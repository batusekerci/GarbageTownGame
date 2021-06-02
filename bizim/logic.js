
export function remainingTime(duration,display){
	var timer = duration, minutes, seconds;
	let interval = setInterval(function () {
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.textContent = minutes + ":" + seconds;

		if (--timer < 0) {
			clearInterval(interval);
		}
	}, 1000);
}

export function showUnbuiltInfo(){


	return " Press Key\n 1: Geothermal  [Cost: 5.000$]\n\t\t[Immediate pollution reduction: 175]\n\t\t[Pollution reduction per second: 2]\n\n" +
		"2: Solar Panel  [Cost: 4.000$]\n\t\t[Immediate pollution reduction: 150]\n\t\t[Pollution reduction per second: 1]\n\n" +
		"3: Wind Turbine  [Cost: 4.000$]\n\t\t[Immediate pollution reduction: 150]\n\t\t[Pollution reduction per second: 1]\n\n"  +
		"4: Biomass Factory  [Cost: 7.500$]\n\t\t[Immediate pollution reduction: 250]\n\t\t[Pollution reduction per second: 3]\n\n" +
		"5: Park  [Cost: 1.500$]\n\t\t[Immediate pollution reduction: 100]\n\t\t[Pollution reduction per second: 1]\n\n"
		;

}

export function getDetailedFacilityInfo(facilityType, upgradeLevel,IPR,PRS){

	if(facilityType==="Recycling Facility"){
		if(upgradeLevel===1){
			return "This facility [Level = 1]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]\n\t\t\t[Truck speed: "+facilityDB.recycling["1"].speed+"]"
				+"\n\n\t\t[Next Level: 2]\n\t\t "+"\t\t[Cost: "+facilityDB.recycling["2"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.recycling["2"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.recycling["2"].PRS+"]\n\t\t\t[Truck speed: "+facilityDB.recycling["2"].speed+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===2){
			return "This facility [Level = 2]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]\n\t\t\t[Truck speed: "+facilityDB.recycling["2"].speed+"]"
				+"\n\n\t\t[Next Level: 3]\n\t\t "+"\t\t[Cost: "+facilityDB.recycling["3"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.recycling["3"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.recycling["3"].PRS+"]\n\t\t\t[Truck speed: "+facilityDB.recycling["3"].speed+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===3){
			return "This facility [Level = 3]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]\n\t\t\t[Truck speed: "+facilityDB.recycling["1"].speed+"]"
				+"\n\t\tMax Level Reached\n";
		}
	}
	if(facilityType==="Geothermal"){
		if(upgradeLevel===1){
			return "This facility [Level = 1]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\n\t\t[Next Level: 2]\n\t\t "+"\t\t[Cost: "+facilityDB.geothermal["2"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.geothermal["2"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.geothermal["2"].PRS+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===2){
			return "This facility [Level = 2]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]\n"
				+"\n\n\t\t[Next Level: 3]\n\t\t "+"\t\t[Cost: "+facilityDB.geothermal["3"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.geothermal["3"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.geothermal["3"].PRS+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===3){
			return "This facility [Level = 3]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]\n"+
				"\n\t\tMax Level Reached\n";
		}
	}
	if(facilityType==="Solar Panel"){
		if(upgradeLevel===1){
			return "This facility [Level = 1]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\n \t\t[Next Level: 2]\n\t\t "+"\t\t[Cost: "+facilityDB.solar_panel["2"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.solar_panel["2"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.solar_panel["2"].PRS+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===2){
			return "This facility [Level = 2]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\n \t\t[Next Level: 3]\n\t\t "+"\t\t[Cost: "+facilityDB.solar_panel["3"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.solar_panel["3"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.solar_panel["3"].PRS+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===3){
			return "This facility [Level = 3]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\t\tMax Level Reached\n";
		}
	}
	if(facilityType==="Wind Turbine"){
		if(upgradeLevel===1){
			return "This facility [Level = 1]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\n \t\t[Next Level: 2]\n\t\t "+"\t\t[Cost: "+facilityDB.wind_turbine["2"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.wind_turbine["2"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.wind_turbine["2"].PRS+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===2){
			return "This facility [Level = 2]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\n \t\t[Next Level: 3]\n\t\t "+"\t\t[Cost: "+facilityDB.wind_turbine["3"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.wind_turbine["3"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.wind_turbine["3"].PRS+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===3){
			return "This facility [Level = 3]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\t\tMax Level Reached\n";
		}
	}
	if(facilityType==="Biomass Factory"){
		if(upgradeLevel===1){
			return "This facility [Level = 1]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\n \t\t[Next Level: 2]\n\t\t "+"\t\t[Cost: "+facilityDB.biomass["2"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.biomass["2"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.biomass["2"].PRS+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===2){
			return "This facility [Level = 2]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\n \t\t[Next Level: 2]\n\t\t "+"\t\t[Cost: "+facilityDB.biomass["3"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.biomass["3"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.biomass["3"].PRS+"]"+
				"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===3){
			return "This facility [Level = 3]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"+
				"\n\t\tMax Level Reached\n";
		}
	}
	if(facilityType==="Park"){
		if(upgradeLevel===1){
			return "This facility [Level = 1]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\n \t\t[Next Level: 2]\n\t\t "+"\t\t[Cost: "+facilityDB.park["2"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.park["2"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.park["2"].PRS+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===2){
			return "This facility [Level = 2]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\\n\n \t\t[Next Level: 3]\n\t\t "+"\t\t[Cost: "+facilityDB.park["3"].Cost+"]\n\t\t\t\t[Immediate pollution reduction: "+facilityDB.park["3"].IPR+"]\n\t\t\t\t[Pollution reduction per second: "+facilityDB.park["3"].PRS+"]"
				+"\n\nPress Key 'U' for upgrade";
		}
		else if(upgradeLevel===3){
			return "This facility [Level = 3]\n\t\t gives  [Immediate pollution reduction: "+IPR+"]\n\t\t\t[Pollution reduction per second: "+PRS+"]"
				+"\n\t\tMax Level Reached\n";
		}
	}

}

export let facilityDB = {
	geothermal:{
		1: { Cost: 5000, IPR: 175, PRS: 2, tips: "\nGeothermal power plants increase water quality and decrease water consumption.\n"},
		2: { Cost: 7000, IPR: 200, PRS: 4, tips: "\nSO2 emissions from geothermal plants are approximately\n30 times lower per megawatt-hour than from coal plants\n"},
		3: { Cost: 9000, IPR: 225, PRS: 7, tips: "\nCarbon footprint of a geothermal power plant is low.\n"},
	},
	wind_turbine : {
		1: { Cost: 4000, IPR: 150, PRS: 1, tips: "\nWind is a renewable energy source. Overall, using wind to produce energy\nhas fewer effects on the environment than many other energy sources. \n"},
		2: { Cost: 6000, IPR: 175, PRS: 2, tips: "\nWind turbines do not release emissions that can pollute the air.\n"},
		3: { Cost: 8000, IPR: 200, PRS: 5, tips: "\nWind turbines may also reduce the amount of electricity generation from fossil fuels, which results in lower total air pollution and carbon dioxide emissions.\n"},

	},
	solar_panel : {
		1: { Cost: 4000, IPR: 150, PRS: 1, tips: "\nSolar panels create clean energy that won’t contribute to air pollution.\n"},
		2: { Cost: 6000, IPR: 175, PRS: 2, tips: "\nSolar panels create energy without water nor a negative impact on the ecosystem.\n"},
		3: { Cost: 8000, IPR: 200, PRS: 5, tips: "\nSolar energy is one of the ways we can try to prevent the effects of climate\nchange. By reducing our CO2 emissions, and releasing fewer pollutants in the air.\n"},
	},
	biomass : {
		1: { Cost: 7500, IPR: 250, PRS: 3, tips: "\nThe organic materials used to produce biomass are infinite, since\nour society consistently produces waste such as garbage. \n"},
		2: { Cost: 10000, IPR: 300, PRS: 7, tips: "\nAs a natural part of photosynthesis, biomass fuels only release the\nsame amount of carbon into the atmosphere as was absorbed by plants during their life cycle. \n"},
		3: { Cost: 12500, IPR: 350, PRS: 12, tips: "\nBiomass energy also reduces the overreliance of fossil fuels.\n"},
	},
	park : {
		1: { Cost: 1500, IPR: 100, PRS: 1, tips: "\nParks and greening works are proven to improve water quality, protect\ngroundwater, prevent flooding, improve the quality of the air we breathe.\n"},
		2: { Cost: 2500, IPR: 125, PRS: 2, tips: "\nPhysical activity can reduce or prevent many physical and mental health problems.\n"},
		3: { Cost: 4500, IPR: 150, PRS: 4, tips: "\nTrees are vital for mitigating the urban heat island effect and can\nlower air temperatures by up to nine degrees, cut air conditioning use by 30%.\n"},
	},
	recycling :{
		1: { Cost: 0, IPR: 0, PRS: 0 , speed: 1},
		2: { Cost: 10000, IPR: 350, PRS: 1, speed: 1.5},
		3: { Cost: 15000, IPR: 500, PRS: 2, speed: 2},
	},
}
