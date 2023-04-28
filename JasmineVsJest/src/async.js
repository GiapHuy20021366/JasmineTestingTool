const waitTime = async (time = 1000) => {
  await new Promise((resolve) => setTimeout(resolve, time));
  return "Done";
};

// module.exports = waitTime;
