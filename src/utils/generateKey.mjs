const generateCodeOnlyNumbers = (min, max) => {
  min = Math.ceil(1000);
  max = Math.floor(9999);
  return (Math.floor(Math.random() * (max - min)) + min).toString();
};

export default generateCodeOnlyNumbers;
