const roleHarvester = require("role.harvester");
const roleBuilder = require("role.builder");
const roleFixer = require("role.fixer");
const roleUpgrader = require("role.upgrader");
const roleMover = require("role.mover");
const roleWaller = require("role.waller");
const roleAmmo = require("role.ammo");
const upkeep = require("upkeep");
const Memory = require("memory");
const Role = require("constants");
const UI = require("ui.utils");
const Utils = require("utils");

module.exports.loop = function() {
  Memory.clean();

  runSpawns();
  runCreeps();
};

const runSpawns = () => {
  for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];

    UI.displayNumberOfCreeps(spawn);
    UI.displayCurrentAvailableEnergy(spawn);

    upkeep(spawn);
    attackHostilesWithTowers(spawn);
  }
};

const runCreeps = () => {
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];

    Utils.assignHarvestSource(creep);
    run(creep);
  }
};

const run = creep => {
  switch (creep.memory.role) {
    case Role.HARVESTER:
      roleHarvester.run(creep);
      return;
    case Role.BUILDER:
      roleBuilder.run(creep);
      return;
    case Role.FIXER:
      if (creep.room.energyAvailable < 1050) {
        roleFixer.emergency(creep);
      } else {
        roleFixer.run(creep);
      }
      return;
    case Role.UPGRADER:
      roleUpgrader.run(creep);
      return;
    case Role.MOVER:
      roleMover.run(creep);
      return;
    case Role.WALLER:
      roleWaller.run(creep);
      return;
    case Role.AMMO:
      roleAmmo.run(creep);
      return;
  }
};

const attackHostilesWithTowers = spawn => {
  const hostiles = spawn.room.find(FIND_HOSTILE_CREEPS);
  if (hostiles.length > 0) {
    const towers = spawn.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });
    towers.forEach(tower => tower.attack(hostiles[0]));
  }
};
