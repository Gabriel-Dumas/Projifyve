const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const sleep = require('sleep');
const random = require('random');
const fs = require('fs');

const credentials = {
    username: '',
    password: '',
};

const music = '$MUSIC_LINK';
const sessionName = '$YOUR_SESSION_NAME';

const proxyAddress = '';

const option = new chrome.Options().addArguments('--headless');
//.addArguments(`--proxy-server=http:${proxyAddress}`)
const {
    Builder,
    By,
    Key
} = webdriver;

let driver = new Builder().forBrowser('chrome').setChromeOptions().build();

const bot = {

    routine: async (music) => {
        
        await bot.login(credentials.username, credentials.password);
        await bot.streamMusic(music);

    },

    login: async (username, password) => {

        try {

            await driver.get('https://www.spotify.com/login');
            await driver.findElement(By.xpath('//*[@id="login-username"]')).sendKeys(username);
            await driver.findElement(By.xpath('//*[@id="login-password"]')).sendKeys(password, Key.RETURN);

        } finally {

            console.log('Login successfull');
            sleep.sleep(2);
            //bot.takeScreenshot();
            return 

        }

    },

    streamMusic: async (music) => {

        try {

        const REFRESH_TIME = 38;
        const streamsNbr = 10;
        let currentStreamIndex = 0;

        await driver.get(music);
        sleep.sleep(2);
        await driver.findElement(By.className('control-button--circled')).click();
        sleep.sleep(6);
        console.log('Screen ?');
        //bot.takeScreenshot();

        while (currentStreamIndex < streamsNbr) {
            if (currentStreamIndex !== 0) {
                await driver.get(music);
            }
            sleep.sleep(REFRESH_TIME);
            currentStreamIndex += 1;
            //bot.takeScreenshot();
            console.log('stream nbr ', currentStreamIndex);
            
        };

        } catch (e) {

            console.error(e);            

        }
    },

    takeScreenshot: () => {

        driver.takeScreenshot().then(function(data) {
            fs.writeFileSync(`/Users/${pcName}/Desktop/Test_Shot/Stream-${currentStreamIndex}.png`, data, 'base64');
        });

    },

    createAccount: async (email, password, username) => {

        try {


            // In progress, trying to figure out how not to trigger the reCaptcha
            await driver.get('https://www.spotify.com/signup/');
            await driver.findElement(By.xpath('//*[@id="register-email"]')).sendKeys(email);
            await driver.findElement(By.xpath('//*[@id="register-confirm-email"]')).sendKeys(email);
            await driver.findElement(By.xpath('//*[@id="register-password"]')).sendKeys(password);
            await driver.findElement(By.xpath('//*[@id="register-displayname"]')).sendKeys(username);
            await driver.findElement(By.xpath('//*[@id="register-dob-day"]')).sendKeys(random.int(min = 1, max = 28));
            //await driver.findElement(By.xpath('//*[@id="register-dob-day"]')).sendKeys(random.int(min = 1, max = 28));
            //await driver.findElement(By.xpath('//*[@id="register-dob-day"]')).sendKeys(random.int(min = 1, max = 28));
            const captcha = await driver.findElement(By.xpath('//*[@id="recaptcha-anchor"]/div[1]'));
            driver.action.move_to(captcha).click(captcha).perform;

        } catch (e) {

            console.error(e);

        } finally {

            console.log('Account created successfully');
            sleep.sleep(5);
            await driver.quit();

        }

    },
}

bot.routine(music);