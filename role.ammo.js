const Utils = require("utils");

roleAmmo = {
  run: creep => {
    if (creep.store[RESOURCE_ENERGY] == 0) {
      Utils.withdrawFromStorageOrHarvest(creep);
      return;
    }

    const find = Utils.findStructuresWithFreeCapacity(creep, RESOURCE_ENERGY);
    const transfer = Utils.transferResourceToClosest(creep, RESOURCE_ENERGY);

    const towers = find([STRUCTURE_TOWER]);

    if (!towers || towers.length == 0) return;

    transfer(towers);
  }
};

module.exports = roleAmmo;
