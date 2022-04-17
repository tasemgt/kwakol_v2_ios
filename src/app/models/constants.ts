export const constants = {
    baseUrl:  'https://kwml.work/api/v1',
    currentUser: 'CURRENT_KWAKOL_USER',
    currentProfile: 'CURRENT_KWAKOL_PROFILE',
    userProfile: 'KWAKOL_USER_PROFILE',
    oneSignalAppID: 'cddc3c9c-6675-4256-b028-e8bf65c4702c',
    googleProjectNumberSenderID: '1033837099492'
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
    }
};

export const historyIcons = {
    bonus: 'bonus',
    deposit: 'deposit',
    profit: 'profit',
    withdrawal: 'withdrawal'
}

export const investmentIcons = {
    levadura: 'levadura-big',
    marigold: 'marigold-big',
    junzi: 'junzi-big',
    antipasto: 'antipasto-big',
    veterano: 'veterano-big',
    'fixed deposit': 'fixed-deposit-big'
}

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
}

//Data Service::
//Email 'id': 1
//User 'id': 2
//Phone 'id': 3
