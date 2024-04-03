export const constants = {
    baseUrl:  'https://kwml.work/api/v1',
    baseUrlV2:  'https://v2test.kwml.work/api',
    // baseUrlV2Test:  'https://v2test.kwml.work/api',
    currentUser: 'CURRENT_KWAKOL_USER_v2',
    currentProfile: 'CURRENT_KWAKOL_PROFILE',
    userProfile: 'KWAKOL_USER_PROFILE',
    lockedState: 'KWAKOL_LOCKED_STATE',
    kwakolAuto: 'KWAKOL_AUTOLOCK',
    oneSignalAppID: 'cddc3c9c-6675-4256-b028-e8bf65c4702c',
    googleProjectNumberSenderID: '1033837099492',
    metaMapClientId: '648b2ca69b0070001ae7e91c',
    metaMapFlowId: '64d4d6224a4fcb001c22fe33'
};

export const alertPageParams = {
    emailSent: {
        image: 'alert-email-sent',
        title: 'Email sent',
        desc: 'We have sent the password recovery instructions to your email address.',
        btn: {
            text: 'Login'
        }
    },
    lockedScreen: {
        image: 'app-locked',
        title: 'Session Expired',
        desc: 'Your app has been locked due to inactivity. Please unlock to continue.',
        btn: {
            text: 'Unlock',
            url: '/tabs/home'
        }
    }
};

export const historyIcons = {
    bonus: 'trans-bonus',
    deposit: 'trans-deposit',
    profit: 'trans-profit',
    withdrawal: 'trans-withdraw',
    transfer: 'trans-transfer-plan'
};

export const investmentIcons = {
    levadura: 'levadura-big',
    marigold: 'marigold-big',
    junzi: 'junzi-big',
    antipasto: 'antipasto-big',
    veterano: 'veterano-big',
    'fixed deposit': 'fixed-deposit-big'
};

export const investmentIconsBanner = {
    levadura: 'levadura-banner',
    marigold: 'marigold-banner',
    junzi: 'junzi-banner',
    antipasto: 'antipasto-banner',
    veterano: 'veterano-banner',
    'fixed deposit': 'fixed-deposit-banner'
};


export const investmentBGColors = {
    levadura: '#D8C680',
    marigold: '#AF9685',
    junzi: '#295513',
    antipasto: 'antipasto-big',
    veterano: 'veterano-big',
    'fixed deposit': 'fixed-deposit-big'
};

export const countries = [
    {name: 'Nigeria', img: 'nigeria'},
    {name: 'United States of America', img: 'usa'},
    {name: 'United Kingdom', img: 'uk'},
    {name: 'Ghana', img: 'ghana'},
    {name: 'South Africa', img: 'sa'},
    {name: 'Brazil', img: 'brazil'},
    {name: 'Portugal', img: 'portugal'},
    {name: 'France', img: 'france'}
  ];

//Data Service::
//Email 'id': 1
//User 'id': 2
//Phone 'id': 3
