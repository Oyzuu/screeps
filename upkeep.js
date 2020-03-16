const Role = require("constants");
const UI = require("ui.utils");

const PartsValue = {
  move: 50,
  work: 100,
  carry: 50,
  attack: 80,
  ranged_attack: 150,
  heal: 250,
  claim: 600,
  tough: 10
};

const sortedRoles = [
  Role.HARVESTER,
  Role.UPGRADER,
  Role.FIXER,
  Role.BUILDER,
  Role.WALLER,
  Role.AMMO
];

const getNumberOfBuilders = spawn => {
  const numberOfConstructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES).length;

  if (numberOfConstructionSites > 15) return 2;

  return numberOfConstructionSites > 0 ? 1 : 0;
};

const getNumberOfAmmos = spawn => {
  const towers = spawn.room.find(FIND_MY_STRUCTURES, {
    filter: structure =>
      structure.structureType === STRUCTURE_TOWER &&
      structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  });

  return !!towers.length ? 1 : 0;
};

const getParts = (part, number) => new Array(number).fill(part);

const baseParts = [CARRY, ...getParts(WORK, 2), ...getParts(MOVE, 3), ...getParts(TOUGH, 5)];

const RoleValues = spawn => ({
  [Role.HARVESTER]: {
    parts: [...baseParts, ...getParts(WORK, 6), ...getParts(MOVE, 6), ...getParts(CARRY, 2)],
    // parts: [WORK, MOVE, CARRY],
    maxUnits: 5
  },
  [Role.BUILDER]: {
    parts: baseParts,
    maxUnits: getNumberOfBuilders(spawn)
  },
  [Role.FIXER]: {
    parts: [...baseParts, WORK, MOVE, MOVE],
    maxUnits: 1
  },
  [Role.WALLER]: {
    parts: [...baseParts, WORK, MOVE, MOVE],
    maxUnits: 1
  },
  [Role.MOVER]: {
    parts: [...baseParts, CARRY, CARRY, MOVE],
    maxUnits: 0
  },
  [Role.UPGRADER]: {
    parts: [...baseParts, ...getParts(WORK, 3), ...getParts(CARRY, 3)],
    maxUnits: 2
  },
  [Role.AMMO]: {
    parts: baseParts,
    maxUnits: getNumberOfAmmos(spawn)
  }
});

const getCostForParts = parts => parts.reduce((sum, value) => (sum += PartsValue[value]), 0);

const upkeep = spawn => {
  sortedRoles.forEach((role, index) => {
    const { parts, maxUnits } = RoleValues(spawn)[role];

    UI.displayCreepCost(spawn, role, getCostForParts(parts), index);

    const units = _.filter(Game.creeps, creep => creep.memory.role == role);

    if (units.length < maxUnits && !spawn.spawning) {
      const name = role + Game.time;

      spawn.spawnCreep(parts, name, {
        memory: { role }
      });
    }
  });
};

module.exports = upkeep;
