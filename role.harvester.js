const Utils = require("utils");

const PRIMARIES = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];
const STORAGES = [STRUCTURE_STORAGE];
const TOWERS = [STRUCTURE_TOWER];

const roleHarvester = {
  /** @param {Creep} creep **/
  run: creep => {
    // Process
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    } else {
      if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[creep.memory.sourceIndex]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[creep.memory.sourceIndex], {
            visualizePathStyle: { stroke: "#ffaa00" }
          });
        }
      } else {
        const find = Utils.findStructuresWithFreeCapacity(creep, RESOURCE_ENERGY);
        const transfer = Utils.transferResourceToClosest(creep, RESOURCE_ENERGY);

        for (const structureTypes of [PRIMARIES, STORAGES, TOWERS]) {
          const structures = find(structureTypes);

          if (structures && structures.length > 0) {
            transfer(structures);
            return;
          }
        }

        creep.memory.upgrading = true;
        creep.say("⚡ upgrade");
      }
    }
  }
};

module.exports = roleHarvester;
