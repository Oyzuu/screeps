const roleMover = {
  run: creep => {
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
          [STRUCTURE_STORAGE].includes(structure.structureType) && structure.store.getCapacity() > 0
      });

      if (!matchingStructures && matchingStructures.length == 0) return;
      const container = matchingStructures[0];

      if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {
          visualizePathStyle: { stroke: "#ffaa00" }
        });
      }
    } else {
      const targets = findStructures([STRUCTURE_TOWER]);
      if (targets.length > 0) {
        transferToFirstTarget(targets);
      }
    }
  }
};

module.exports = roleMover;
