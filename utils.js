/**
 * Find the closest non-empty storage. If no storage is available, creep will harvest
 * at its assigned sourceIndex.
 *
 * @param {Creep} creep : A creep with 'sourceIndex' property in memory
 */
const withdrawFromStorageOrHarvest = creep => {
  const containers = creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      structure.structureType === STRUCTURE_STORAGE &&
      structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
  });

  if (containers.length == 0) {
    const sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[creep.memory.sourceIndex]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[creep.memory.sourceIndex], {
        visualizePathStyle: { stroke: "#ffaa00" }
      });
    }
    return;
  }

  const container = creep.pos.findClosestByRange(containers);
  if (!container) return;

  if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(container, {
      visualizePathStyle: { stroke: "#ffaa00" }
    });
  }
};

/**
 * Randomly assign a source index to spread creeps around sources.
 *
 * @param {Creep} creep : any creep
 */
const assignHarvestSource = creep => {
  if (creep.memory.sourceIndex !== undefined) return;

  const sources = creep.room.find(FIND_SOURCES);

  let indexForLessAssignees = 0;
  sources.forEach((source, index) => {
    if (!Memory[source.id]) {
      Memory[source.id] = { assignees: 0 };
    }

    if (Memory[source.id].assignees < Memory[sources[indexForLessAssignees].id].assignees) {
      indexForLessAssignees = index;
    }
  });

  creep.memory.sourceIndex = indexForLessAssignees;

  const id = sources[indexForLessAssignees].id;

  Memory[id].assignees += 1;

  console.log(`${creep.name} has been assigned to source #${indexForLessAssignees}`);
};

const transferResourceToClosest = (creep, resourceType) => targets => {
  const closest = creep.pos.findClosestByRange(targets);

  if (!closest) return;

  if (creep.transfer(closest, resourceType) == ERR_NOT_IN_RANGE) {
    creep.moveTo(closest, {
      visualizePathStyle: { stroke: "#ffffff" }
    });
  }
};

const findStructuresWithFreeCapacity = (creep, resourceType) => targets => {
  return creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      targets.includes(structure.structureType) && structure.store.getFreeCapacity(resourceType) > 0
  });
};

module.exports = {
  withdrawFromStorageOrHarvest,
  assignHarvestSource,
  transferResourceToClosest,
  findStructuresWithFreeCapacity
};
