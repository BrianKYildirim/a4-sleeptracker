import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonDatetimeButton, IonModal, IonDatetime, IonSelect, IonSelectOption, IonButton, IonList, IonListHeader, IonNote, IonText } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [DatePipe, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonDatetimeButton, IonModal, IonDatetime, IonSelect, IonSelectOption, IonButton, IonList, IonListHeader, IonNote, IonText],
})
export class HomePage {
	segment = 'overnight';
	ratings = [1, 2, 3, 4, 5, 6, 7];
	scaleValues = StanfordSleepinessData.ScaleValues;

	bedtime = '';
	wakeTime = '';
	editingOvernight:OvernightSleepData | null = null;

	rating:number | null = null;
	ratingTime = '';
	editingSleepiness:StanfordSleepinessData | null = null;

  constructor(public sleepService:SleepService, private alertController:AlertController) {
		this.resetOvernightForm();
		this.resetSleepinessForm();
	}

	async ngOnInit() {
		await this.sleepService.load();
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

	get overnightData() {
		return SleepService.AllOvernightData;
	}

	get sleepinessData() {
		return SleepService.AllSleepinessData;
	}

	toLocalString(date:Date):string {
		const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
		return local.toISOString().slice(0, 16);
	}

	get overnightError():string {
		if (!this.bedtime || !this.wakeTime) {
			return 'Please choose both a bedtime and a wake-up time.';
		}
		const hours = (new Date(this.wakeTime).getTime() - new Date(this.bedtime).getTime()) / (1000 * 60 * 60);
		if (hours <= 0) {
			return 'Wake-up time must be after bedtime.';
		}
		if (hours > 24) {
			return 'A sleep session cannot be longer than 24 hours.';
		}
		return '';
	}

	get sleepinessError():string {
		if (this.rating === null || !Number.isInteger(this.rating) || this.rating < 1 || this.rating > 7) {
			return 'Please choose a rating from 1 to 7.';
		}
		if (!this.ratingTime) {
			return 'Please choose a date and time.';
		}
		return '';
	}

	resetOvernightForm() {
		const bed = new Date();
		bed.setDate(bed.getDate() - 1);
		bed.setHours(23, 0, 0, 0);
		const wake = new Date();
		wake.setHours(7, 0, 0, 0);
		this.bedtime = this.toLocalString(bed);
		this.wakeTime = this.toLocalString(wake);
		this.editingOvernight = null;
	}

	resetSleepinessForm() {
		this.rating = null;
		this.ratingTime = this.toLocalString(new Date());
		this.editingSleepiness = null;
	}

	saveOvernight() {
		if (this.overnightError) {
			return;
		}
		const start = new Date(this.bedtime);
		const end = new Date(this.wakeTime);
		if (this.editingOvernight) {
			this.editingOvernight.sleepStart = start;
			this.editingOvernight.sleepEnd = end;
			this.sleepService.save();
		} else {
			this.sleepService.logOvernightData(new OvernightSleepData(start, end));
		}
		this.resetOvernightForm();
	}

	saveSleepiness() {
		if (this.sleepinessError || this.rating === null) {
			return;
		}
		const time = new Date(this.ratingTime);
		if (this.editingSleepiness) {
			this.editingSleepiness.loggedValue = this.rating;
			this.editingSleepiness.loggedAt = time;
			this.sleepService.save();
		} else {
			this.sleepService.logSleepinessData(new StanfordSleepinessData(this.rating, time));
		}
		this.resetSleepinessForm();
	}

	editOvernight(data:OvernightSleepData) {
		this.editingOvernight = data;
		this.bedtime = this.toLocalString(data.sleepStart);
		this.wakeTime = this.toLocalString(data.sleepEnd);
	}

	editSleepiness(data:StanfordSleepinessData) {
		this.editingSleepiness = data;
		this.rating = data.loggedValue;
		this.ratingTime = this.toLocalString(data.loggedAt);
	}

	async confirmDelete(onDelete:() => void) {
		const alert = await this.alertController.create({
			header: 'Delete record?',
			message: 'This record will be permanently removed.',
			buttons: [
				{ text: 'Cancel', role: 'cancel' },
				{ text: 'Delete', role: 'destructive', handler: onDelete },
			],
		});
		await alert.present();
	}

	deleteOvernight(data:OvernightSleepData) {
		this.confirmDelete(() => {
			if (this.editingOvernight === data) {
				this.resetOvernightForm();
			}
			this.sleepService.deleteOvernightData(data);
		});
	}

	deleteSleepiness(data:StanfordSleepinessData) {
		this.confirmDelete(() => {
			if (this.editingSleepiness === data) {
				this.resetSleepinessForm();
			}
			this.sleepService.deleteSleepinessData(data);
		});
	}
}
