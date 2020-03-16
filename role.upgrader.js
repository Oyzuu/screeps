const Utils = require("utils");

const roleUpgrader = {
  /** @param {Creep} creep **/
  run: creep => {
    // When store is full
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say("🔄 upgrading");
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    }

    // When store is empty
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 pickup");
    }

    if (!creep.memory.upgrading && creep.store.getFreeCapacity() > 0) {
      // Harvesting
      Utils.withdrawFromStorageOrHarvest(creep);
    }
  }
};

module.exports = roleUpgrader;
