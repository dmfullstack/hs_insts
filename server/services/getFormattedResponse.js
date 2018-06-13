function getFormattedResponse(response) {
  const formattedResponse = {};
  const measureMetrics = 'ncloc function_complexity file_complexity complexity'.split(' ');
  console.log('response.component.measures:', response.component.measures);
  const measures = response.component.measures.filter((item) => {
    return measureMetrics.indexOf(item.metric) >= 0;
  });

  measures.forEach((measure) => {
    formattedResponse[measure.metric] = measure.value;
  });

  return formattedResponse;
};

module.exports = getFormattedResponse;
