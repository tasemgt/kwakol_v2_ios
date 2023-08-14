export const constants = {
    baseUrl:  'https://kwml.work/api/v1',
    baseUrlV2:  'https://v2.kwml.work/api',
    currentUser: 'CURRENT_KWAKOL_USER',
    currentProfile: 'CURRENT_KWAKOL_PROFILE',
    userProfile: 'KWAKOL_USER_PROFILE',
    oneSignalAppID: 'cddc3c9c-6675-4256-b028-e8bf65c4702c',
    googleProjectNumberSenderID: '1033837099492',
    metaMapClientId: '648b2ca69b0070001ae7e91c',
    metaMapFlowId: '64d4d6224a4fcb001c22fe33'
};

export const alertPageParams = {
    emailSent: {
        image: 'alert-email-sent',
        title: 'Email Sent',
        desc: 'We have sent the password recovery instructions to your email address.',
        btn: {
            text: 'Back to Login',
            url: '/login'
        }
    },
    passwordChanged: {
        image: 'padlock',
        title: 'Password Changed',
        desc: 'Great going. Your password has been changed and you are now good to go.',
        btn: {
            text: 'Finish',
            url: '/login'
        }
    },
    depositConfirm: {
        image: 'deposit-confirm',
        title: ' ',
        desc: 'Sit tight, your funds are on their way.',
        btn: {
            text: 'Back Home',
            url: '/tabs/home'
        }
    },
    withdrawConfirm: {
        image: 'withdraw-confirm',
        title: 'Request Sent',
        desc: 'Sit tight, your funds are on their way.',
        btn: {
            text: 'Back Home',
            url: '/tabs/home'
        }
    },
    lockedScreen: {
        image: 'padlock-lock',
        title: 'App Locked!',
        desc: 'Your app has been locked to keep your information private. Kindly unlock app to use.',
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
    transfer: 'trans-transfer-user'
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

export const bottomDrawer = {
    banks: [
        { name: 'Wema Bank', selected: false },
        { name: 'United Bank for Africa', selected: false },
        { name: 'Keystone Bank', selected: false },
        { name: 'Taj Bank', selected: false }
    ],
    investments: [
        { name: 'Levadura', balance: '1,255.49', selected: false },
        { name: 'Marigold', balance: '7,534.51', selected: false },
        { name: 'Jūnzi', balance: '15,655.01', selected: false }
    ]
};

//Data Service::
//Email 'id': 1
//User 'id': 2
//Phone 'id': 3
