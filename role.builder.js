const roleFixer = require("role.fixer");
const Utils = require("utils");

const roleBuilder = {
  run: creep => {
    // Behavior assignment conditions
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    // Building
    if (creep.memory.building) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" }
          });
        }
      }

      return;
    }

    // Harvesting
    Utils.withdrawFromStorageOrHarvest(creep);
  },
  fix: creep => {
    roleFixer.run(creep);
  }
};

module.exports = roleBuilder;
