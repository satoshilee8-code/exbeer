const connectButton = document.querySelector("#connectWallet");
const languageMenu = document.querySelector("#languageMenu");
const languageToggle = document.querySelector("#languageToggle");
const languageFlag = document.querySelector("#languageFlag");
const languageLabel = document.querySelector("#languageLabel");
const languageOptions = document.querySelectorAll(".language-option");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const payAmount = document.querySelector("#payAmount");
const receiveAmount = document.querySelector("#receiveAmount");
const leverage = document.querySelector("#leverage");
const leverageValue = document.querySelector("#leverageValue");
const queryAirdropButton = document.querySelector("#queryAirdrop");
const airdropWallet = document.querySelector("#airdropWallet");
const airdropStatus = document.querySelector("#airdropStatus");
const airdropShares = document.querySelector("#airdropShares");
const airdropTokens = document.querySelector("#airdropTokens");
const airdropValuation = document.querySelector("#airdropValuation");
const airdropVesting = document.querySelector("#airdropVesting");
const vestingList = document.querySelector("#vestingList");

const tokensPerShare = 1_000_000;
const exbeerMainnetPrice = 0.05;
const launchDate = new Date("2027-06-13T00:00:00+08:00");
const airdropVestingDates = [
  new Date("2027-06-13T00:00:00+08:00"),
  new Date("2028-06-13T00:00:00+08:00"),
];
const airdropAllocations = {
  "0x1111111111111111111111111111111111111111": 8,
  "0x2222222222222222222222222222222222222222": 3,
  "0x742d35cc6634c0532925a3b844bc454e4438f44e": 12,
  "0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead": 1,
  "0x787806b4509a5478ef8b5e6bc75a30517f748e2c": 3,
  "0xbe55ef8f6b9c96bf7256bfc9d0663783283acf6f": 1,
  "0x1db23fed0254c36bc041b6595fec9bb6bf3756be": 1,
  "0x820a0bdf0f6a3d84789465d4d56053b9e207ab12": 1,
  "0x2510b473e132c36c235833317750aabab09baa64": 0.5,
  "0x07156c23bf1080cd7976390962159b36ffd1f830": 0.5,
};

const i18n = {
  zh: {
    homeTitle: "ExBeer | ex.beer",
    launchpadPageTitle: "首页 | ExBeer",
    spotPageTitle: "现货交易 | ExBeer",
    perpsPageTitle: "合约交易 | ExBeer",
    stakingPageTitle: "发射台 | ExBeer",
    daoPageTitle: "DAO | ExBeer",
    airdropTitle: "EXB 空投 | ExBeer",
    navAria: "主导航",
    navHome: "首页",
    navAirdrop: "空投查询",
    navSpot: "现货交易",
    navPerp: "合约",
    navStaking: "发射台",
    navAdmin: "后台",
    connectWallet: "连接钱包",
    walletMissing: "未检测到钱包",
    walletFailed: "连接失败",
    reconnectWallet: "重新连接钱包",
    installWallet: "请安装钱包后查询",
    platformStatus: "平台状态",
    chartAria: "行情图",
    heroStatus: "ex.beer · BSC 发射台 + 链上合约交易所",
    heroTitle: "新资产首发、认购、解锁与交易，在同一个链上终端完成。",
    heroCopy: "ExBeer（ex.beer）面向 BNB Chain 项目方与交易用户，连接 IDO 发行、流动性上线、Swap 与永续合约市场。",
    homeHeroStatus: "ex.beer · BSC 链上发射平台",
    homeHeroTitle: "ExBeer",
    homeHeroCopy: "基于 BSC 的链上发射平台与合约交易入口，连接项目首发、交易流动性、DAO 治理、质押权益与 EXB 空投查询。",
    homePrimaryAction: "查询 EXB 空投",
    homeSecondaryAction: "了解平台功能",
    homeNetworkLabel: "底层网络",
    homeDomainLabel: "官网域名",
    homeTokenLabel: "生态代币",
    homeLaunchLabel: "上线时间",
    homeFeatureEyebrow: "Platform Modules",
    homeFeatureTitle: "围绕 BSC 新资产生命周期设计的四个核心模块",
    homeFeatureLaunchpadTitle: "链上发射平台",
    homeFeatureLaunchpadCopy: "支持项目首发、白名单、认购、额度分配、解锁展示与链上领取记录，帮助 BSC 项目完成冷启动。",
    homeFeatureExchangeTitle: "合约交易所",
    homeFeatureExchangeCopy: "规划接入 Swap 与永续合约市场，提供新资产上线后的价格发现、流动性承接与风险参数展示。",
    homeFeatureStakingTitle: "质押权益",
    homeFeatureStakingCopy: "使用 EXB 质押等级连接 Launchpad 额度、手续费权益、空投资格与生态治理权重。",
    homeFeatureDaoTitle: "DAO 治理",
    homeFeatureDaoCopy: "通过 DAO 参与项目准入、参数调整、费用分配、回购销毁等关键决策，让社区参与平台增长。",
    homeFlowEyebrow: "On-chain Flow",
    homeFlowTitle: "从项目发行到交易治理，一条链路完成",
    homeFlowCopy: "ExBeer 将发行、认购、解锁、流动性、质押与治理组合成统一体验，减少用户在多个站点之间切换的成本。",
    homeFlowStepOne: "项目提交与社区筛选",
    homeFlowStepTwo: "白名单、认购和空投分配",
    homeFlowStepThree: "上线交易、质押和 DAO 治理",
    homeTerminalEyebrow: "Unified Web3 Terminal",
    homeTerminalTitle: "把发射、交易、质押和空投查询放进同一个链上入口",
    homeTerminalCopy: "ExBeer 面向 BSC 新资产生态设计，项目方可以展示发行进度、锁仓与上线节奏，用户则可以在同一处查看额度、参与认购、跟踪解锁并进入交易市场。",
    homeTerminalLaunches: "发行入口",
    homeTerminalMarkets: "交易市场",
    homeTerminalRights: "权益层",
    homeTerminalRecords: "链上记录",
    homeMapEyebrow: "Ecosystem Map",
    homeMapTitle: "围绕 EXB 的平台权益与增长路径",
    homeMapAirdropTitle: "空投额度",
    homeMapAirdropCopy: "用户连接钱包后查询 EXB 空投份额，额度分两期解锁，并按主网上线价格展示资产估值。",
    homeMapLaunchTitle: "项目首发",
    homeMapLaunchCopy: "发射台承载白名单、认购、额度等级与上线倒计时，让新项目有清晰的链上发布路径。",
    homeMapTradeTitle: "交易承接",
    homeMapTradeCopy: "现货与合约模块用于承接项目上线后的价格发现、流动性和风险参数展示。",
    homeMapGovernanceTitle: "社区治理",
    homeMapGovernanceCopy: "DAO 将用于项目筛选、费用分配、生态激励与关键参数调整，让社区参与平台长期建设。",
    viewLiveProjects: "查看进行中项目",
    enterTerminal: "进入交易台",
    metricRaised: "累计融资",
    metricProjects: "32 个项目",
    metricVolume: "24h 交易量",
    metricWallets: "活跃钱包",
    filterAll: "全部",
    statusLive: "进行中",
    statusUpcoming: "即将开始",
    statusEnded: "已结束",
    launchpadTitle: "热门首发项目",
    asterCopy: "AI 代理结算网络，使用 EXB 质押等级分配 IDO 额度。",
    asterRaised: "已募 $740K",
    nebulaCopy: "BSC 原生永续合约流动性池，支持 BNB、BTCB、ETH 市场。",
    whitelistCount: "白名单 4,820",
    startsIn: "2 天后",
    vaultCopy: "跨项目金库管理协议，发售后已进入 ExBeer Swap 池。",
    vaultRaised: "已募 $1.2M",
    subscribe: "认购",
    viewDetails: "查看详情",
    claimTokens: "领取代币",
    tierTitle: "质押等级",
    tierStarter: "1x 额度",
    tierPro: "2x 额度",
    tierPrime: "5x 额度",
    stakeBlx: "质押 EXB",
    tradeTitle: "链上交易台",
    askOne: "卖一",
    bidOne: "买一",
    slippage: "滑点",
    pay: "支付",
    receive: "获得",
    confirmSwap: "确认兑换",
    long: "做多",
    short: "做空",
    leverage: "杠杆",
    margin: "保证金",
    liqPrice: "强平价",
    fundingRate: "资金费率",
    openPosition: "开仓",
    riskTitle: "合约风控与项目治理",
    auditTitle: "合约审计",
    auditCopy: "多签发布、紧急暂停、权限透明",
    lockTitle: "项目锁仓",
    lockCopy: "代币解锁、LP 锁定、链上凭证",
    oracleTitle: "预言机保护",
    oracleCopy: "价格偏离、资金费率、强平缓冲",
    daoTitle: "DAO 投票",
    daoCopy: "项目准入、手续费分配、回购销毁",
    tokenUtility: "质押、手续费折扣、Launchpad 额度与治理投票",
    viewTokenomics: "查看经济模型",
    airdropHeroStatus: "EXB 空投资格查询",
    airdropHeroTitle: "EXB 空投矩阵",
    airdropHeroCopy: "连接钱包读取你的链上空投份额，并查看 EXB 两阶段解锁时间轴。每一份对应 1,000,000 枚代币。",
    airdropQueryTitle: "钱包空投额度查询",
    airdropTokenLabel: "空投代币",
    airdropCardCopy: "链接 OKX Wallet 或 MetaMask 后，系统会按当前钱包地址查询 EXB 空投额度。额度按份数计算，每份等于 1,000,000 枚 EXB。",
    unitLabel: "计量单位",
    shareUnit: "份",
    tokensPerShareLabel: "单份数量",
    mainnetPriceLabel: "主网上线定价",
    claimNetworkLabel: "领取网络",
    currentWallet: "当前钱包",
    notConnected: "未连接",
    waitingQuery: "等待查询",
    connected: "已连接",
    noAllocation: "暂无额度",
    claimable: "可领取",
    exbeerShares: "EXB 份数",
    tokenEquivalent: "折合代币",
    assetValuation: "总资产估值",
    vestingScheduleTitle: "解锁计划",
    vestingScheduleCopy: "额度分两期领取",
    vestingPhaseOne: "第一期解锁",
    vestingPhaseTwo: "第二期解锁",
    unlockDateLabel: "解锁时间",
    claimAmountLabel: "领取额度",
    claimNow: "领取",
    lockedUntil: "未到解锁时间",
    queryMyAirdrop: "查询我的空投",
    queryAgain: "重新查询",
    connectFirst: "请先连接钱包",
    shareSuffix: "份",
    claimStripCopy: "正式上线后可在本页接入领取合约、签名校验与链上领取记录。",
    backLaunchpad: "返回发射台",
    countdownKicker: "T-MINUS TO LAUNCH",
    countdownTitle: "主网上线倒计时",
    countdownDays: "天",
    countdownHours: "小时",
    countdownMinutes: "分钟",
    countdownSeconds: "秒",
    countdownLaunchTime: "上线时间：2027年6月13日 00:00:00",
  },
  en: {
    homeTitle: "ExBeer | ex.beer",
    launchpadPageTitle: "Home | ExBeer",
    spotPageTitle: "Spot Trading | ExBeer",
    perpsPageTitle: "Perpetuals | ExBeer",
    stakingPageTitle: "Launchpad | ExBeer",
    daoPageTitle: "DAO | ExBeer",
    airdropTitle: "EXB Airdrop | ExBeer",
    navAria: "Primary navigation",
    navHome: "Home",
    navAirdrop: "Airdrop",
    navSpot: "Spot",
    navPerp: "Perps",
    navStaking: "Launchpad",
    navAdmin: "Admin",
    connectWallet: "Connect Wallet",
    walletMissing: "Wallet not found",
    walletFailed: "Connection failed",
    reconnectWallet: "Reconnect Wallet",
    installWallet: "Install a wallet to query",
    platformStatus: "Platform status",
    chartAria: "Market chart",
    heroStatus: "ex.beer · BSC Launchpad + On-chain Contract Exchange",
    heroTitle: "Launch, subscribe, unlock, and trade new assets in one on-chain terminal.",
    heroCopy: "ExBeer (ex.beer) connects IDO issuance, liquidity launch, Swap, and perpetual markets for BNB Chain projects and traders.",
    homeHeroStatus: "ex.beer · BSC On-chain Launch Platform",
    homeHeroTitle: "ExBeer",
    homeHeroCopy: "A BSC-based on-chain launchpad and contract trading gateway connecting launches, liquidity, DAO governance, staking rights, and EXB airdrop lookup.",
    homePrimaryAction: "Check EXB Airdrop",
    homeSecondaryAction: "Explore Features",
    homeNetworkLabel: "Network",
    homeDomainLabel: "Domain",
    homeTokenLabel: "Ecosystem Token",
    homeLaunchLabel: "Launch Date",
    homeFeatureEyebrow: "Platform Modules",
    homeFeatureTitle: "Four core modules designed for the BSC new-asset lifecycle",
    homeFeatureLaunchpadTitle: "On-chain Launchpad",
    homeFeatureLaunchpadCopy: "Support token launches, whitelists, subscriptions, allocation tiers, unlock views, and on-chain claim records for BSC projects.",
    homeFeatureExchangeTitle: "Contract Exchange",
    homeFeatureExchangeCopy: "Planned Swap and perpetual markets support price discovery, liquidity onboarding, and risk parameter displays after launch.",
    homeFeatureStakingTitle: "Staking Rights",
    homeFeatureStakingCopy: "EXB staking tiers connect Launchpad allocation, fee benefits, airdrop eligibility, and ecosystem governance weight.",
    homeFeatureDaoTitle: "DAO Governance",
    homeFeatureDaoCopy: "DAO participation covers project admission, parameter changes, fee allocation, buybacks, burns, and community-led growth.",
    homeFlowEyebrow: "On-chain Flow",
    homeFlowTitle: "From launch to trading and governance in one path",
    homeFlowCopy: "ExBeer combines issuance, subscription, unlocks, liquidity, staking, and governance into one cohesive experience.",
    homeFlowStepOne: "Project submission and community screening",
    homeFlowStepTwo: "Whitelist, subscription, and airdrop allocation",
    homeFlowStepThree: "Trading launch, staking, and DAO governance",
    homeTerminalEyebrow: "Unified Web3 Terminal",
    homeTerminalTitle: "Launches, trading, staking, and airdrop lookup in one on-chain entry",
    homeTerminalCopy: "ExBeer is designed for the BSC new-asset ecosystem. Projects can present launch progress, vesting, and go-live timing, while users can check allocations, join subscriptions, track unlocks, and enter markets from one place.",
    homeTerminalLaunches: "Launch Entry",
    homeTerminalMarkets: "Markets",
    homeTerminalRights: "Rights Layer",
    homeTerminalRecords: "On-chain Records",
    homeMapEyebrow: "Ecosystem Map",
    homeMapTitle: "Platform rights and growth paths around EXB",
    homeMapAirdropTitle: "Airdrop Allocation",
    homeMapAirdropCopy: "Users connect wallets to check EXB airdrop shares, view two-phase unlocks, and see estimated value based on the mainnet listing price.",
    homeMapLaunchTitle: "Project Launches",
    homeMapLaunchCopy: "The launchpad carries whitelists, subscriptions, tier allocation, and launch countdowns for a clear on-chain release path.",
    homeMapTradeTitle: "Market Support",
    homeMapTradeCopy: "Spot and contract modules are designed to support price discovery, liquidity, and risk parameter displays after launch.",
    homeMapGovernanceTitle: "Community Governance",
    homeMapGovernanceCopy: "DAO governance will cover project screening, fee allocation, ecosystem incentives, and key parameter updates.",
    viewLiveProjects: "View Live Projects",
    enterTerminal: "Enter Trading Desk",
    metricRaised: "Total Raised",
    metricProjects: "32 Projects",
    metricVolume: "24h Volume",
    metricWallets: "Active Wallets",
    filterAll: "All",
    statusLive: "Live",
    statusUpcoming: "Upcoming",
    statusEnded: "Ended",
    launchpadTitle: "Featured Launches",
    asterCopy: "AI agent settlement network with IDO allocations based on EXB staking tiers.",
    asterRaised: "$740K Raised",
    nebulaCopy: "BSC-native perpetual liquidity pools supporting BNB, BTCB, and ETH markets.",
    whitelistCount: "4,820 Whitelisted",
    startsIn: "Starts in 2 days",
    vaultCopy: "Cross-project treasury protocol, now listed in the ExBeer Swap pool after sale.",
    vaultRaised: "$1.2M Raised",
    subscribe: "Subscribe",
    viewDetails: "View Details",
    claimTokens: "Claim Tokens",
    tierTitle: "Staking Tiers",
    tierStarter: "1x Allocation",
    tierPro: "2x Allocation",
    tierPrime: "5x Allocation",
    stakeBlx: "Stake EXB",
    tradeTitle: "On-chain Trading Desk",
    askOne: "Best Ask",
    bidOne: "Best Bid",
    slippage: "Slippage",
    pay: "Pay",
    receive: "Receive",
    confirmSwap: "Confirm Swap",
    long: "Long",
    short: "Short",
    leverage: "Leverage",
    margin: "Margin",
    liqPrice: "Liq. Price",
    fundingRate: "Funding Rate",
    openPosition: "Open Position",
    riskTitle: "Contract Risk Controls & Governance",
    auditTitle: "Contract Audit",
    auditCopy: "Multisig releases, emergency pause, transparent permissions",
    lockTitle: "Project Vesting",
    lockCopy: "Token unlocks, LP locks, and on-chain certificates",
    oracleTitle: "Oracle Protection",
    oracleCopy: "Price deviation, funding rate, and liquidation buffers",
    daoTitle: "DAO Voting",
    daoCopy: "Project admission, fee allocation, buybacks, and burns",
    tokenUtility: "Staking, fee discounts, Launchpad allocation, and governance voting",
    viewTokenomics: "View Tokenomics",
    airdropHeroStatus: "EXB Eligibility Check",
    airdropHeroTitle: "EXB Airdrop Matrix",
    airdropHeroCopy: "Connect your wallet to read your airdrop allocation and view the two-stage EXB unlock timeline. Each share equals 1,000,000 tokens.",
    airdropQueryTitle: "Wallet Airdrop Lookup",
    airdropTokenLabel: "Airdrop Token",
    airdropCardCopy: "After connecting OKX Wallet or MetaMask, the system checks the EXB airdrop allocation for the current wallet. Allocation is counted in shares, with each share equal to 1,000,000 EXB.",
    unitLabel: "Unit",
    shareUnit: "Share",
    tokensPerShareLabel: "Tokens per Share",
    mainnetPriceLabel: "Mainnet Listing Price",
    claimNetworkLabel: "Claim Network",
    currentWallet: "Current Wallet",
    notConnected: "Not Connected",
    waitingQuery: "Waiting",
    connected: "Connected",
    noAllocation: "No Allocation",
    claimable: "Claimable",
    exbeerShares: "EXB Shares",
    tokenEquivalent: "Token Equivalent",
    assetValuation: "Estimated Asset Value",
    vestingScheduleTitle: "Unlock Schedule",
    vestingScheduleCopy: "Allocation unlocks in two phases",
    vestingPhaseOne: "Phase 1 Unlock",
    vestingPhaseTwo: "Phase 2 Unlock",
    unlockDateLabel: "Unlock Date",
    claimAmountLabel: "Claim Amount",
    claimNow: "Claim",
    lockedUntil: "Unlock time has not arrived",
    queryMyAirdrop: "Query My Airdrop",
    queryAgain: "Query Again",
    connectFirst: "Connect wallet first",
    shareSuffix: "shares",
    claimStripCopy: "At launch, this page can connect to claim contracts, signature verification, and on-chain claim records.",
    backLaunchpad: "Back to Launchpad",
    countdownKicker: "T-MINUS TO LAUNCH",
    countdownTitle: "Mainnet Countdown",
    countdownDays: "Days",
    countdownHours: "Hours",
    countdownMinutes: "Minutes",
    countdownSeconds: "Seconds",
    countdownLaunchTime: "Launch time: June 13, 2027 00:00:00",
  },
};

let connectedAddress = "";
const languageStorageKey = "exbeerLanguageV2";
let currentLanguage = localStorage.getItem(languageStorageKey) || "en";
let lastQueriedShares = null;
let toastTimer = null;
const walletStorageKey = "exbeerConnectedWallet";

const shortAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const normalizeAddress = (address) => (address || "").trim().toLowerCase();
const t = (key) => i18n[currentLanguage][key] || i18n.zh[key] || key;
const formatNumber = (value) => new Intl.NumberFormat(currentLanguage === "zh" ? "zh-CN" : "en-US").format(value);

function updateConnectedWallet(address, persist = true) {
  connectedAddress = address || "";

  if (persist) {
    if (connectedAddress) {
      localStorage.setItem(walletStorageKey, connectedAddress);
    } else {
      localStorage.removeItem(walletStorageKey);
    }
  }

  if (connectButton) {
    connectButton.textContent = connectedAddress ? shortAddress(connectedAddress) : t("connectWallet");
    connectButton.dataset.connected = connectedAddress ? "true" : "";
    connectButton.classList.remove("error");
  }

  if (airdropWallet) {
    airdropWallet.textContent = connectedAddress ? shortAddress(connectedAddress) : t("notConnected");
  }
}

function restoreStoredWallet() {
  const storedAddress = localStorage.getItem(walletStorageKey);
  if (storedAddress) {
    updateConnectedWallet(storedAddress, false);
  }
}

async function verifyStoredWallet() {
  const ethereum = getWalletProvider();
  if (!ethereum) {
    return;
  }

  try {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts?.[0]) {
      updateConnectedWallet(accounts[0]);
    } else if (localStorage.getItem(walletStorageKey)) {
      updateConnectedWallet("");
    }
  } catch (error) {
    // Keep the restored display if the wallet provider blocks silent checks.
  }
}

function showToast(message) {
  let toast = document.querySelector("#appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "app-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function getWalletProvider() {
  return window.okxwallet || window.ethereum;
}

function reportWalletLogin(address) {
  if (!address) {
    return;
  }

  fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType: "wallet_login",
      walletAddress: address,
      page: window.location.pathname || "/",
    }),
    keepalive: true,
  }).catch(() => {});
}

function renderLaunchCountdown() {
  if (!document.body.classList.contains("locked-page")) {
    return;
  }

  const countdown = document.createElement("div");
  countdown.className = "launch-countdown-card";
  countdown.innerHTML = `
    <span class="countdown-kicker" data-i18n="countdownKicker">Launch Countdown</span>
    <strong data-i18n="countdownTitle">上线倒计时</strong>
    <div class="countdown-grid" aria-live="polite">
      <div><b id="countdownDays">--</b><small data-i18n="countdownDays">天</small></div>
      <div><b id="countdownHours">--</b><small data-i18n="countdownHours">小时</small></div>
      <div><b id="countdownMinutes">--</b><small data-i18n="countdownMinutes">分钟</small></div>
      <div><b id="countdownSeconds">--</b><small data-i18n="countdownSeconds">秒</small></div>
    </div>
    <em data-i18n="countdownLaunchTime">上线时间：2027年6月13日 00:00:00</em>
  `;
  document.body.appendChild(countdown);
  applyTranslations();

  const setValue = (id, value) => {
    const element = document.querySelector(id);
    const next = String(value).padStart(2, "0");
    if (element && element.textContent !== next) {
      element.textContent = next;
      element.classList.remove("tick");
      window.requestAnimationFrame(() => element.classList.add("tick"));
    }
  };

  const updateCountdown = () => {
    const diff = Math.max(0, launchDate.getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setValue("#countdownDays", days);
    setValue("#countdownHours", hours);
    setValue("#countdownMinutes", minutes);
    setValue("#countdownSeconds", seconds);
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

function renderHomeCountdown() {
  const countdownValues = document.querySelectorAll("[data-home-countdown]");
  if (!countdownValues.length) {
    return;
  }

  const setValue = (unit, value) => {
    const element = document.querySelector(`[data-home-countdown="${unit}"]`);
    const next = String(value).padStart(2, "0");
    if (element && element.textContent !== next) {
      element.textContent = next;
      element.classList.remove("tick");
      window.requestAnimationFrame(() => element.classList.add("tick"));
    }
  };

  const updateCountdown = () => {
    const diff = Math.max(0, launchDate.getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);

    setValue("days", Math.floor(totalSeconds / 86400));
    setValue("hours", Math.floor((totalSeconds % 86400) / 3600));
    setValue("minutes", Math.floor((totalSeconds % 3600) / 60));
    setValue("seconds", totalSeconds % 60);
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  const titleKeys = {
    home: "homeTitle",
    launchpad: "launchpadPageTitle",
    spot: "spotPageTitle",
    perps: "perpsPageTitle",
    staking: "stakingPageTitle",
    dao: "daoPageTitle",
    airdrop: "airdropTitle",
  };
  document.title = t(titleKeys[document.body.dataset.page] || "homeTitle");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    if (element.id === "connectWallet" && connectedAddress) {
      return;
    }
    if (element.id === "airdropWallet" && connectedAddress) {
      return;
    }
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  if (languageToggle) {
    languageToggle.setAttribute("aria-expanded", languageMenu?.classList.contains("open") ? "true" : "false");
    languageToggle.setAttribute("aria-label", currentLanguage === "zh" ? "当前语言：中文" : "Current language: English");
  }

  if (languageFlag) {
    languageFlag.className = `language-flag ${currentLanguage === "zh" ? "flag-cn" : "flag-us"}`;
  }

  if (languageLabel) {
    languageLabel.textContent = currentLanguage === "zh" ? "中文" : "English";
  }
}

function setButtonState(key) {
  if (queryAirdropButton) {
    queryAirdropButton.dataset.i18n = key;
    queryAirdropButton.textContent = t(key);
  }
}

function formatUsdt(value) {
  return `${formatNumber(value)} USDT`;
}

function setAirdropEmpty(buttonKey, statusKey = "waitingQuery") {
  if (!airdropWallet || !airdropStatus || !airdropShares || !airdropTokens || !queryAirdropButton) {
    return;
  }

  airdropWallet.textContent = connectedAddress ? shortAddress(connectedAddress) : t("notConnected");
  airdropStatus.dataset.i18n = statusKey;
  airdropStatus.textContent = t(statusKey);
  airdropShares.textContent = "--";
  airdropTokens.textContent = "--";
  if (airdropValuation) {
    airdropValuation.textContent = "--";
  }
  airdropStatus.className = "tag upcoming";
  lastQueriedShares = null;
  renderAirdropVesting(0);
  setButtonState(buttonKey);
}

function formatUnlockDate(date) {
  return currentLanguage === "zh"
    ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function renderAirdropVesting(shares) {
  if (!airdropVesting || !vestingList) {
    return;
  }

  vestingList.innerHTML = "";

  if (shares <= 0) {
    airdropVesting.classList.add("hidden");
    return;
  }

  airdropVesting.classList.remove("hidden");
  const phaseShares = shares / 2;
  const phaseTokens = phaseShares * tokensPerShare;
  const phases = [
    { title: t("vestingPhaseOne"), date: airdropVestingDates[0] },
    { title: t("vestingPhaseTwo"), date: airdropVestingDates[1] },
  ];

  phases.forEach((phase, index) => {
    const item = document.createElement("article");
    item.className = "vesting-item";
    item.innerHTML = `
      <div>
        <span>${phase.title}</span>
        <strong>${formatNumber(phaseShares)} ${t("shareSuffix")} / ${formatNumber(phaseTokens)} EXB</strong>
      </div>
      <div>
        <span>${t("unlockDateLabel")}</span>
        <strong>${formatUnlockDate(phase.date)}</strong>
      </div>
      <button class="vesting-claim" type="button" data-vesting-index="${index}">${t("claimNow")}</button>
    `;
    vestingList.appendChild(item);
  });
}

function renderAirdropResult(shares) {
  if (!airdropWallet || !airdropStatus || !airdropShares || !airdropTokens) {
    return;
  }

  airdropWallet.textContent = shortAddress(connectedAddress);
  lastQueriedShares = shares;
  setButtonState("queryAgain");

  if (shares <= 0) {
    airdropStatus.dataset.i18n = "noAllocation";
    airdropStatus.textContent = t("noAllocation");
    airdropStatus.className = "tag ended";
    airdropShares.textContent = "0";
    airdropTokens.textContent = "0 EXB";
    if (airdropValuation) {
      airdropValuation.textContent = formatUsdt(0);
    }
    renderAirdropVesting(0);
    return;
  }

  airdropStatus.dataset.i18n = "claimable";
  airdropStatus.textContent = t("claimable");
  airdropStatus.className = "tag live";
  const totalTokens = shares * tokensPerShare;
  airdropShares.textContent = `${formatNumber(shares)} ${t("shareSuffix")}`;
  airdropTokens.textContent = `${formatNumber(totalTokens)} EXB`;
  if (airdropValuation) {
    airdropValuation.textContent = formatUsdt(totalTokens * exbeerMainnetPrice);
  }
  renderAirdropVesting(shares);
}

async function syncConnectedAddress() {
  const ethereum = getWalletProvider();

  if (!ethereum) {
    return "";
  }

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  updateConnectedWallet(accounts[0] || "");

  return connectedAddress;
}

async function queryAirdrop() {
  if (!queryAirdropButton) {
    return;
  }

  try {
    await syncConnectedAddress();
  } catch (error) {
    setAirdropEmpty("reconnectWallet", "walletFailed");
    return;
  }

  if (!connectedAddress) {
    setAirdropEmpty("connectFirst", "notConnected");
    return;
  }

  const shares = await fetchAirdropShares(connectedAddress);
  renderAirdropResult(shares);
}

async function fetchAirdropShares(address) {
  try {
    const response = await fetch(`/api/airdrop?address=${encodeURIComponent(address)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Airdrop API request failed");
    }

    const data = await response.json();
    return Number(data.shares || 0);
  } catch (error) {
    return airdropAllocations[normalizeAddress(address)] || 0;
  }
}

async function connectWallet() {
  const ethereum = getWalletProvider();

  if (!ethereum) {
    if (connectButton) {
      connectButton.textContent = t("walletMissing");
      connectButton.classList.add("error");
    }
    setAirdropEmpty("installWallet", "walletMissing");
    return;
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const chainId = await ethereum.request({ method: "eth_chainId" });

    if (chainId !== "0x38") {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38",
                chainName: "BNB Smart Chain",
                nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com"],
              },
            ],
          });
        }
      }
    }

    updateConnectedWallet(accounts[0] || "");
    reportWalletLogin(accounts[0] || "");
    setAirdropEmpty("queryMyAirdrop", "connected");
  } catch (error) {
    if (connectButton) {
      connectButton.textContent = t("walletFailed");
    }
    setAirdropEmpty("reconnectWallet", "walletFailed");
  }
}

connectButton?.addEventListener("click", connectWallet);
queryAirdropButton?.addEventListener("click", queryAirdrop);
vestingList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vesting-index]");
  if (!button) {
    return;
  }

  const unlockDate = airdropVestingDates[Number(button.dataset.vestingIndex)];
  if (Date.now() < unlockDate.getTime()) {
    showToast(t("lockedUntil"));
  }
});
function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem(languageStorageKey, currentLanguage);
  languageMenu?.classList.remove("open");
  applyTranslations();

  if (lastQueriedShares !== null) {
    renderAirdropResult(lastQueriedShares);
  } else if (!connectedAddress && airdropWallet) {
    airdropWallet.textContent = t("notConnected");
  }
}

languageToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  languageMenu?.classList.toggle("open");
  languageToggle.setAttribute("aria-expanded", languageMenu?.classList.contains("open") ? "true" : "false");
});

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setLanguage(option.dataset.language);
  });
});

document.addEventListener("click", (event) => {
  if (!languageMenu?.contains(event.target)) {
    languageMenu?.classList.remove("open");
    languageToggle?.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    languageMenu?.classList.remove("open");
    languageToggle?.setAttribute("aria-expanded", "false");
  }
});

if (getWalletProvider()) {
  const walletProvider = getWalletProvider();
  walletProvider.on?.("accountsChanged", (accounts) => {
    updateConnectedWallet(accounts[0] || "");
    setAirdropEmpty("queryMyAirdrop", connectedAddress ? "connected" : "waitingQuery");
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.status === filter;
      card.style.display = visible ? "" : "none";
    });
  });
});

payAmount?.addEventListener("input", () => {
  const value = Number(payAmount.value || 0);
  receiveAmount.value = (value * 618.24 * 0.9985).toFixed(2);
});

leverage?.addEventListener("input", () => {
  leverageValue.textContent = `${leverage.value}x`;
});

restoreStoredWallet();
applyTranslations();
verifyStoredWallet();
renderHomeCountdown();
renderLaunchCountdown();
