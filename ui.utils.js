const BASE_TEXT_STYLE = {
  align: "left",
  opacity: 0.5
};

const displayCurrentAvailableEnergy = spawn => {
  spawn.room.visual.text(`energy: ${spawn.room.energyAvailable}`, 15, 0, {
    ...BASE_TEXT_STYLE,
    color: "#fff969"
  });
};

const displayNumberOfCreeps = spawn => {
  const groupedCreeps = _.groupBy(Game.creeps, "memory.role");

  let i = 0;
  for (const groupe in groupedCreeps) {
    const text = `${groupe}: ${groupedCreeps[groupe].length}`;
    spawn.room.visual.text(text, 15, 1 + i, BASE_TEXT_STYLE);

    i++;
  }
};

const displayCreepCost = (spawn, role, cost, index) => {
  spawn.room.visual.text(`${role} = ${cost} 💎`, 30, 0 + index, {
    ...BASE_TEXT_STYLE,
    align: "right"
  });
};

module.exports = {
  displayCurrentAvailableEnergy,
  displayNumberOfCreeps,
  displayCreepCost
};
