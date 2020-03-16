const Utils = require("utils");

const repairTargets = [
  STRUCTURE_STORAGE,
  STRUCTURE_CONTAINER,
  STRUCTURE_ROAD,
  STRUCTURE_TOWER,
  STRUCTURE_RAMPART
];

const roleFixer = {
  run: creep => {
    // Behavior assignment conditions
    if (creep.memory.fixing && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.fixing = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.fixing && creep.store.getFreeCapacity() == 0) {
      creep.memory.fixing = true;
      creep.say("🚧 Fixing");
    }

    // Fixing
    if (creep.memory.fixing) {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure =>
          repairTargets.includes(structure.structureType) &&
          structure.hits <
            structure.hitsMax * (structure.structureType === STRUCTURE_RAMPART ? 0.001 : 0.6)
      });

      if (!targets.length) return;

      if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }

      return;
    }

    // Harvesting
    Utils.withdrawFromStorageOrHarvest(creep);
  },
  emergency: creep => {
    const transferToFirstTarget = targets => {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    };

    const findStructures = targets => {
      return creep.room.find(FIND_STRUCTURES, {
        filter: structure =>
          targets.includes(structure.structureType) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      });
    };

    if (creep.store[RESOURCE_ENERGY] == 0) {
      const matchingStructures = creep.room.find(FIND_STRUCTURES, {
        filter: structure =>
          [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].includes(structure.structureType) &&
          structure.store.getCapacity() > 0
      });

      if (!matchingStructures && matchingStructures.length == 0) return;
      const container = matchingStructures[0];

      if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {
          visualizePathStyle: { stroke: "#ffaa00" }
        });
      }
    } else {
      const targets = findStructures([STRUCTURE_EXTENSION, STRUCTURE_SPAWN]);
      if (targets.length > 0) {
        transferToFirstTarget(targets);
      }
    }
  },
  transferToStorage: creep => {
    const transferToFirstTarget = targets => {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    };

    const findStructures = targets => {
      return creep.room.find(FIND_STRUCTURES, {
        filter: structure =>
          targets.includes(structure.structureType) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      });
    };

    if (creep.store[RESOURCE_ENERGY] == 0) {
      const matchingStructures = creep.room.find(FIND_STRUCTURES, {
        filter: structure =>
          [STRUCTURE_CONTAINER].includes(structure.structureType) &&
          structure.store.getCapacity() > 0
      });

      if (!matchingStructures && matchingStructures.length == 0) return;
      const container = matchingStructures[0];

      if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {
          visualizePathStyle: { stroke: "#ffaa00" }
        });
      }
    } else {
      const targets = findStructures([STRUCTURE_STORAGE]);
      if (targets.length > 0) {
        transferToFirstTarget(targets);
      }
    }
  }
};

module.exports = roleFixer;
