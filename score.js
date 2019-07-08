const outputs = [];
// const predicationPoint = 300;
// const k =3;
const k =10;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {

  outputs.push([dropPosition,bounciness,size,bucketLabel]);

  //console.log(outputs);

}

function runAnalysis() {
  const testSetSize = 100;
  // const bucket = console.log(`Your points will probably fall in the bucket: ${bucket}`);

  // const[testSet, trainingSet] = splitDataset(minMax(outputs,3), testSetSize);
  
    // let numberCorrect = 0;
    // for(let i =0;i<testSet.length;i++)
    // {
    //     const bucket = knn(trainingSet,testSet[i][0]);
    //     // console.log(bucket,testSet[i][3]);
    //     if(bucket === testSet[i][3])
    //     {
    //       numberCorrect++;
    //     }
    // }

    // console.log(`Accuracy:`, numberCorrect / testSetSize);
     
    _.range(1, 11).forEach(feature => {

      const data = _.map(outputs, row => [row[feature], _.last(row)]);
      const[testSet, trainingSet] = splitDataset(minMax(data,1), testSetSize);

        const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet,_.initial(testPoint),k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value();

      console.log(`For feature of ${feature} Accuracy: ${accuracy}`);
      });
}
function knn(data, point, k)
{
return _.chain(data)
.map(row => {
 return [
   distance(_.initial(row),point),
   //row[3]
   _.last(row)
  ];
})
.sortBy(row => row[0])
.slice(0,k)
.countBy(row => row[1])
.toPairs()
.sortBy(row => row[1])
.last()
.first()
.parseInt()
.value();

}

function distance(pointA, pointB)
{

  // pointA = 300, pointB = 300
  //pointA = [300,.5,16], pointB = [350,.55,16]
  //  return Math.abs(pointA - pointB);
   pointA = [1,1];
 pointB = [4,5];

  return 	_.chain(pointA)
		.zip(pointB)
		.map(([a,b]) => (a - b) **2 )
		.sum()
		.value() ** 0.5;
    
}

function splitDataset(data, testCount)
{
    const shuffled = _.shuffle(data);

    const testSet = _.slice(shuffled,0, testCount);
    const trainingSet = _.slice(shuffled,testCount);

    return [testSet, trainingSet];
}

function minMax(data, featureCount)
{
    const clonedData = _.cloneDeep(data);

    for(let i =0; i < featureCount; i++)
    {
      const column = clonedData.map(row => row[i]);

      const min = _.min(column);
      const max = _.max(column);

      for(let j = 0;j < clonedData.length;j++)
      {
        clonedData[j][i] = (clonedData[j][i] - min)/(max - min);
      }

    }

    return clonedData;
}