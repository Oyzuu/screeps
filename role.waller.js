const Utils = require("utils");

const repairTargets = [STRUCTURE_WALL];
const ratios = [0.001, 0.01, 0.05, 0.1];

const findWalls = creep => {
  let walls = [];

  for (const ratio of ratios) {
    walls = creep.room.find(FIND_STRUCTURES, {
      filter: structure =>
        repairTargets.includes(structure.structureType) &&
        structure.hits < structure.hitsMax * ratio
    });

    if (walls.length > 0) break;
  }

  return walls;
};

/**
 * Basically a fixer solely for walls
 */
const roleWaller = {
  test: creep => findWalls(creep),
  run: creep => {
    if (creep.memory.walling && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.walling = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.walling && creep.store.getFreeCapacity() == 0) {
      creep.memory.walling = true;
      creep.say("🚧 walling");
    }

    if (creep.memory.walling) {
      const walls = findWalls(creep);

      if (!walls.length) return;

      if (creep.repair(walls[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(walls[0], {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }

      return;
    }

    // Harvesting
    Utils.withdrawFromStorageOrHarvest(creep);
  }
};

module.exports = roleWaller;
