import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';
import { AuthService } from '@providers/util/auth.service';
import { Events } from 'ionic-angular';
import { NetworkService } from '@providers/util/network.service';
import { Deeplinks } from '@ionic-native/deeplinks';

@Component({
  templateUrl: 'app.html'
})
export class NavMathApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string;

  pages: Array<{ title: string; component: any; icon: string }>;

  version: string = '0.0.0';

  session: any = {};

  constructor(
    private translate: TranslateService,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private appVersion: AppVersion,
    private authService: AuthService,
    private networkService: NetworkService,
    private keyboard: Keyboard,
    public events: Events,
    private deeplinks: Deeplinks,
    private zone: NgZone
  ) {
    this.initializeApp();

    this.pages = [
      {
        title: 'Dashboard',
        component: 'DashboardPage',
        icon: 'icon-dashboard'
      },
      { title: 'Proficiency', component: 'PlayerPage', icon: 'star' },
      {
        title: 'Preferences',
        component: 'ProficiencyPage',
        icon: 'icon-preferences'
      },
      { title: 'About Me', component: 'ProficiencyPage', icon: 'icon-about' }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('cordova')) {
        // make your native calls
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.keyboard.disableScroll(false);
        this.appVersion.getVersionNumber().then(version => {
          this.version = version;
        });
        this.setAppVersion();
        this.networkService.isConnect();
      }
      this.initTranslate();
      this.authService.doAuthentication();
      this.eventsRegister();
      this.registerDeeplinks();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }
  }

  setAppVersion() {
    this.appVersion.getVersionNumber().then(version => {
      this.version = version;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  eventsRegister() {
    this.events.subscribe('auth:reAuthenticateDone', sessionModel => {
      this.zone.run(() => {
        this.session = sessionModel;
      });
      this.nav.setRoot('WelcomePage');
    });
    this.events.subscribe('auth:loginCompleted', sessionModel => {
      this.zone.run(() => {
        this.session = sessionModel;
      });
      this.nav.setRoot('DashboardPage');
    });
    this.events.subscribe('auth:initializeAuthCompleted', sessionModel => {
      this.zone.run(() => {
        this.session = sessionModel;
        if (sessionModel.user_id == 'anonymous') {
          this.rootPage = 'WelcomePage';
        } else {
          this.rootPage = 'DashboardPage';
        }
      });
    });
  }

  logout() {
    this.authService.logout();
  }

  registerDeeplinks() {
    this.deeplinks
      .routeWithNavController(this.nav, {
        '/welcome': 'WelcomePage'
      })
      .subscribe(
        match => {
          console.log('Successfully matched route', match);
        },
        nomatch => {
          console.error("Got a deeplink that didn't match", nomatch);
        }
      );
  }
}
