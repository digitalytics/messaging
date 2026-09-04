export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const convertM2H = (totalTimeInMin)=>{
  return `${(Math.floor(totalTimeInMin / 60) <= 9)?`0${Math.floor(totalTimeInMin / 60)}`:Math.floor(totalTimeInMin / 60)}:${(totalTimeInMin % 60 <= 9)?`0${totalTimeInMin % 60}`:totalTimeInMin % 60 || '00'}`;
}
export const convertH2M = (timeInHour)=>{
  var timeParts = timeInHour.split(":");
  return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}
export const generateRandomColor = (length)=>{
  const colorArray = [];
  for (var i = 0; i < length; i++) {
    colorArray.push("#" + Math.floor(Math.random() * 16777215).toString(16));
  }
  return colorArray;
}