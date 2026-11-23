--Readme document for *author(s)*, *email(s)*, *UCI id(s)*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
~16 hours.


3. What online resources did you consult when completing this assignment? (list specific URLs)
https://ionicframework.com/docs/api/datetime
https://capacitorjs.com/docs/apis/preferences


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
None, i worked on this assignment individually.


5. Is there anything special we need to know in order to run your code?
There is nothing special needed, just cd into sleeptracker and run npm install and ionic serve


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
I designed this app with students and other busy people who want to log their sleep in a few seconds each morning in mind. A user can check it easily throughout the day without needing a full-featured sleep tracker.


7. Did you design your app specifically for iOS or Android, or both?
Both, since it only uses standard Ionic components that automatically match each platforms look. I mainly tested it in a phone-sized browser window.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
On the "Overnight sleep" tab the user picks a bedtime and a wake up time and taps "Save sleep record" and the app works out the duration. Both fields are pre-filled with a typical night (11pm to 7am), so most entries only need small changes.


9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
On the "Sleepiness" tab the user chooses a 1–7 Stanford Sleepiness Scale rating from a dropdown which shows the scale's description, then confirms the time (it defaults to now) and taps "Save Sleepiness". Showing the official wording helps users pick the right number, and defaulting to the current time makes quick check ins fast while still allowing several entries per day.


10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
Each tab has a history list right under its form, newest first. Overnight entries show bedtime, wake-up time and duration, and sleepiness entries show the date, time and rating. Keeping the history next to the form lets users confirm their entry was saved straight away without going to another page


11. Which feature choose--using a native device resource, backing up logged data, or both?
Backing up logged data.


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
I chose data backup instead.


13. If you backed up logged data, where does it back up to?
On the device itself, using Capacitor Preferences: browser localStorage when run on the web and the platforms built in key value storage on IOS/Android. Record are saved whenever they are created edited or deleted, and loaded when the app starts so they survive refreshing and reopening the app.


14. How does your app implement or follow principles of good mobile design?
The first screen already shows the logging form, the history, and tabs for switching between the two kinds of data, so nothing is hidden behind extra navigation. For mistakes, every entry can be edited or deleted after a confirmation. for error prevention, the Save button is disabled and a red message explains the problem when times are missing, wake-up isn't after bedtime, sleep is over 24 hours, or no rating is chosen. It also follows platform conventions by using standard Ionic components, so it looks and behaves like a native app on either platform.

