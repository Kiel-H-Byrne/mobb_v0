import OKGAnalytics, { analytics } from '@okgrow/auto-analytics';

const OKGsettings = Meteor.settings.public.analyticsSettings;

OKGAnalytics(OKGsettings);
