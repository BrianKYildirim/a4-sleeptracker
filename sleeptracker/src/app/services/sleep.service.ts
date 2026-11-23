import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = false;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	constructor() {
		if(SleepService.LoadDefaultData) {
			this.addDefaultData();
		SleepService.LoadDefaultData = false;
	}
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm
		this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}

	public logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
		this.save();
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
		this.save();
	}

	public deleteOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter(d => d.id !== sleepData.id);
		this.save();
	}

	public deleteSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(d => d.id !== sleepData.id);
		this.save();
	}

	public async save() {
		SleepService.AllOvernightData.sort((a, b) => b.sleepStart.getTime() - a.sleepStart.getTime());
		SleepService.AllSleepinessData.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
		SleepService.AllSleepData = [...SleepService.AllOvernightData, ...SleepService.AllSleepinessData];
		await Preferences.set({ key: 'overnight', value: JSON.stringify(SleepService.AllOvernightData) });
		await Preferences.set({ key: 'sleepiness', value: JSON.stringify(SleepService.AllSleepinessData) });
	}

	public async load() {
		const overnight = await Preferences.get({ key: 'overnight' });
		const sleepiness = await Preferences.get({ key: 'sleepiness' });

		SleepService.AllOvernightData = JSON.parse(overnight.value || '[]').map((d:any) => {
			const data = new OvernightSleepData(new Date(d.sleepStart), new Date(d.sleepEnd));
			data.id = d.id;
			data.loggedAt = new Date(d.loggedAt);
			return data;
		});
		SleepService.AllSleepinessData = JSON.parse(sleepiness.value || '[]').map((d:any) => {
			const data = new StanfordSleepinessData(d.loggedValue, new Date(d.loggedAt));
			data.id = d.id;
			return data;
		});
		SleepService.AllSleepData = [...SleepService.AllOvernightData, ...SleepService.AllSleepinessData];
	}
}
