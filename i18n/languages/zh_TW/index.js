export default {
  // 通用
  common: {
    loading: '加載中...',
    // 左侧弹出菜单栏
    drawer: {
      certifyStatus: {
        uncertified: '去認證',
        certifying: '審核中',
        certified: '已認證',
      },
      myAccount: '我的賬號',
      userId: '用戶ID',
      accountSafety: '賬號安全',
      teamManage: '團隊管理',
      contactUs: '聯係我們',
      aboutUs: '關於我們',
      helpCenter: '幫助中心',
      logout: '退出賬號',
    },
    empty: '暫無記錄~',
    messages: {
      copySucceed: '複製成功',
      confirmLogout: '是否確認退出？',
      loading: '加載中...',
      empty: '暫無記錄~'
    },
    buttons: {
      confirm: '確認',
      cancel: '取消',
    },
  },

  // 产品页
  product: {
    // 卡片详情
    cardDetail: {
      pageTitle: '卡片詳情',
      depositEntry: '充值',
      cardChannel: '卡片通道',
      cardCreatedBy: '持卡人姓名',
      cardNo: '卡號',
      validDate: '有效期',
      fundsFlow: '資金流水',
      empty: '暫無記錄',
    },
    // 开卡
    openCard: {
      pageTitle: '開卡',
      cards: {
        gold: '金卡',
        blackGold: '黑金卡',
        king: '王卡',
      },
      // 注意事項
      attentions: {
        text1: '開卡後免費郵寄贈送實體卡',
        text2: '持卡消費可獲得{point}積分獎勵',
        text3: '開卡後即可享受平臺免費空投',
        text4:
          '*卡費將直接從賬戶余額中扣除，付款開卡後，將自動開通數字卡，並在7個工作日內為您寄出實體卡牌',
      },
      forms: {
        title: '是否確認支付',
        payAmount: '支付金額',
        confirmPay: '確認支付',
        agreement: {
          prefix: '我已閲讀并同意',
          suffix: '《開卡協議》',
        },
        openCardInterests: {
          title: '開卡後您將解鎖以下權益：',
          text1: '1、終身免費代幣空投',
          text2: '2、每次消費根據金額返{point}積分',
          text3: '3、尊享積分兌換優質項目代幣份額',
          text4: '4、平臺貴賓活動優先參與權',
        },
      },
      bottom: {
        openCardAnnualFee: '開卡年費',
        originPrice: '原價',
        applyNow: '立即申請',
      },
    },
  },

  // 首页
  index: {
    openCardNow: '立即開卡',
    cardManage: '卡片管理',
    static: {
      text1: '賬戶餘額',
      text2: '錢包地址',
      text3: '充值',
      text4: '轉賬',
      text5: '提現',
      text6: '贈卡',
      text7: '資金流水',
      text8: '查看全部',
      text9: '暫無記錄, 請先開卡充值',
    },
    // 卡片管理
    cardManage: {
      pageTitle: '卡片列表',
      openNewCard: '辦理新卡篇',
      openCardNow: '立即辦理',
      validDate: '有效期 {date1} 至 {date2} ',
      noRealName: '待實名',
      buyAt: '購買日期: {buyAt}',
      expired: '已失效',
      certifying: '審核中',
    },

    // 資金流水
    allWater: {
      pageTitle: '資金流水',
      empty: '暫無記錄~',
    },
    // 轉賬
    transfer: {
      pageTitle: '轉賬',
      card: '卡片',
      inputs: {
        choiceCard: '請選擇充值的卡片',
        inputDepositAmount: '請輸入充值金額',
      },
      depositAmount: '充值金額',
      availableBalance: '可用餘額',
      max: '最大',
      attention: {
        title: '注意事項',
        description:
          ' *平台內轉帳無手續費，請確認用戶ID與金額正確，一經轉出，平台無法操作退回。',
      },
      amountDue: '到賬金額',
      handlingFee: '手續費',
      buttons: {
        transferNow: '立即轉賬',
      },
    },
    // 提现
    extract: {
      pageTitle: '提幣',
      inputs: {
        coinAddress: '提幣地址',
        number: '數量',
        minCoinsNumber: '最小提幣數量:{number}',
        all: '全部',
        available: '可用 {price} {coin}',
        handlingFee: '手續費 {minTxFee} {coin}',
        password: '資金密碼',
        code: '驗證碼',
        inputCode: '請輸入驗證碼',
        sendCode: '發送驗證碼',
      },
      buttons: {
        extract: '提幣',
      },
    },
    // 充值
    depositCoins: {
      pageTitle: '充值',
      depositRecords: '充幣記錄',
      deposit: '充值{coin}',
      coinAddress: '{coin} 充幣地址',
      buttons: {
        copyAddress: '複製地址',
      },
    },

    // 赠卡页
    giftCard: {
      pageTitle: '贈卡',
      choiceCard: '1、選擇你想送的卡片',
      amount: {
        title: '額外給好友加個紅包',
        subTitle: '好友激活卡片後，紅包將自動充值到好友帳戶',
        tips: {
          tip1: '*購買後權益未送出不會過期、不可退款。',
          tip2: '*購卡後您將獲得一個兌換碼，好友自行兌換即可激活。',
        },
        inputCustomAmount: '請自行輸入想贈送的金額',
      },
      paymentAmount: '預計支付金額',
      buyNow: '立即購買',
    },
  },

  // 登录页
  login: {
    pageTitle: '用戶登錄',
    form: {
      emailPlaceholder: '請輸入郵箱',
      passwordPlaceholder: '請輸入密碼',
    },
    buttons: {
      submit: '立即登錄',
    },
    links: {
      forgetPassword: '忘記密碼？',
      noAccountYet: '新用戶註冊',
    },
    agreement: {
      prefix: '我已閲讀并同意',
      terms: '《服務協議》',
      and: '和',
      privacy: '《隱私政策》',
    },
  },

  // 注册页
  register: {
    pageTitle: '用戶註冊',
    form: {
      emailPlaceholder: '請輸入電子郵件',
      validationCodePlaceholder: '請輸入驗證碼',
      passwordPlaceholder: '請設置登入密碼',
      confirmPasswordPlaceholder: '請再次輸入登入密碼',
      referrerIdPlaceholder: '推薦人ID (選填)',
      getCode: '獲取驗證碼',
    },
    buttons: {
      submit: '立即註冊',
    },
    agreement: {
      prefix: '我已閲讀并同意',
      suffix: '《使用協議》',
    },
  },

  // 聯係我們
  contactUs: {
    pageTitle: '聯絡我們',
    contactUsIfYouHaveAnyQuestions: '有任何問題，歡迎隨時與我們取得聯繫',
    joinTheCommunity: '加入社區',
    followUs: '關注我們，第一時間了解最新動態',
  },

  // 空投页
  airdrop: {
    pageTitle: '空投',
    container1: {
      text1: '累積獲得空投權益',
      text2: '平台算力排名',
      text3: '近30天領取的免費空投價值',
    },
    container2: {
      text1: '積分兌換空投權益',
      text2: '查看全部',
      text3: '價值',
      text4: '後權益過期',
      text5: '兌換',
    },
    container3: {
      text1: '權益中心',
      text2: '給好友贈送權益或兌換權益',
    },
    list: {
      pageTitle: '兌換列表',
      rightTitle: '歷史兌換',
      text1: '價值',
      text2: '後權益過期',
      text3: '兌換',
    },
    history: {
      pageTitle: '歷史兌換',
    },
  },

  // 用户账号设置
  user: {
    // 账号安全
    secure: {
      pageTitle: '賬號安全',
      title: '為了您的賬戶安全',
      subtitle: '請開啓一下至少一項安全措施',
      option1: '登入密碼',
      option2: '資金密碼',
      option1Page: {
        pageTitle: '修改密碼',
        oldPassword: '舊登入密碼',
        newPassword: '新登入密碼',
        confirmPassword: '確認密碼',
        code: '驗證碼',
        sendCode: '發送驗證碼',
        save: '保存',
      },
      option2Page: {
        pageTitle: '修改資金密碼',
        oldPassword: '舊資金密碼',
        code: '驗證碼',
        sendCode: '發送驗證碼',
        newPassword: '新資金密碼',
        forgetPassword: '忘記密碼？立即重置資金密碼>',
        save: '保存',
      },
    },
    // 团队管理
    team: {
      pageTitle: '團隊管理',
      container1: {
        text1: '您的等級',
        text2: '累計好友返現價值',
        text3: '距離升級還差{number}張卡',
        text4: '享受{number}%返現權益',
        text5: '我的邀請碼',
        text6: '您的專屬邀請鏈接',
        text7: '複製',
      },
      container2: {
        text1: '團隊管理',
        text2: '團隊成員',
        text3: '邀請人數',
        text4: '開卡數量',
      },
      container3: {
        text1: '團隊貢獻榜',
      },
    },
  },
}
