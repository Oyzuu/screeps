const clean = () => {
  for (const name in Memory.creeps) {
    if (Game.creeps[name]) return;

    delete Memory.creeps[name];
    console.log("Clearing non-existing creep memory:", name);
  }
};

module.exports = {
  clean
};
