import React, {useState, useEffect} from 'react';
import MainMarketContract from '../../ABI/MainMarket';
import BondageContract from '../../ABI/Bondage';
import Chart from 'chart.js';

function MainMarketChart() {
	// let data = []; might make gloabel if it keeps rerendering
	// MainMarketContract.events.Bonded({fromBlock: 0},(error, res) => {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		console.log('res ', res.returnValues.dots);
	// 		// setDotData(dotData.push())
	// 		//or
	// 		//appendDatt(res.return.dots);
	// 	}
	// })
	
	const [dotCount, setDotCount] = useState(0);

	//an array of coordiante of dot to cost pair
	const [dotData, setDotData] = useState([{x:0,y:0}]);

	useEffect(() => {
		const initData = async () => {
			await getTotalBonded();
			await parseCurveToData();
			console.log("data: ", dotData);
			displayChart();
		}
		initData();
		// parseCurveToData();
		// console.log("finsh setting data");
		// console.log("data: ", dotData);
		// displayChart();
	}, [dotCount, dotData]);


	// given a number and and array of coefficents returns the output
	// example if coeff = [3,1,5] it will calculate: num*3^0 + num*1^1 + num*5^2
	// As you can see the index presents the exponent
	function calculatePol (num, coeff) {
		let result = 0;
		for (let i = 0; i < coeff.length; i++) { 
			result = result + coeff[i] * num**i;
		}
		return result;
	}


	async function displayChart () {
		var ctx = document.getElementById('myChart').getContext('2d');
		var chart = new Chart(ctx, {
		    // The type of chart we want to create
		    type: 'line',

		    // The data for our dataset
		    data: {
		        datasets: [{
		            label: 'Bonding curve',
		            backgroundColor: 'rgb(255, 99, 132)',
		            borderColor: 'rgb(255, 99, 132)',
		            data: dotData 
		            // [{x:0, y:1},
		            // 		{x:2,y:4}]
		        }]
		    },

		    // Configuration options go here
		    options: {
		    	scales: {
    	            xAxes: [{
    	                type: 'linear',
    	                position: 'bottom'
    	            }]
		    	}
		    }
		});
	}

	async function parseCurveToData() {
		let curve = await MainMarketContract.methods.getCurve().call();
		let data = dotData;

		console.log("dot count, ", dotCount);
		let start = 0; //graph start with x = 0;
		for (let i = 0; i < curve.length;) {
			let upperBound = curve[i + Number(curve[i]) + 1];
			console.log("upperBoun: ", upperBound);
			let upperSlice = i + Number(curve[i]) + 1;
			let coeff = curve.slice(i+1, upperSlice);

			console.log("coeff ", coeff);
			for (let j = start; j < upperBound; j++) {
				//only diplay up to the current total bonded dots
				if (j > dotCount) {
					console.log("j: ", j);
					console.log("dotCount: ", dotCount);
					break;
				}

				let value = calculatePol(j, coeff);
				let dataObject = {
					x: j,
					y: value
				}
				data.push(dataObject);
			}
			i =  i + Number(curve[i]) + 2;
			start = upperBound;
		}

		let mockData = [
			{x:0,y:1},
			{x:2,y:2}
		];

		setDotData(data);
	}
	
	async function getTotalBonded() {
		let mmAddres = MainMarketContract.options.address;
		let endPoint = await MainMarketContract.methods.endPoint().call();
		let totalBonded = await BondageContract.methods.getDotsIssued(mmAddres, endPoint).call();	
		setDotCount(totalBonded);
		// return totalBonded;
	}

	return(
		<canvas id="myChart"></canvas>
	);
}

export default MainMarketChart;