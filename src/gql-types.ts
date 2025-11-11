export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AccountField = {
  __typename?: 'AccountField';
  accountRole: AccountRoles;
  created: Scalars['DateTime'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  oauthProvider?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
};

export type AccountListField = {
  __typename?: 'AccountListField';
  accounts: Array<AccountField>;
  error?: Maybe<AuthErrorCodes>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  totalCount?: Maybe<Scalars['Int']>;
};

export enum AccountRoles {
  Admin = 'ADMIN',
  Standard = 'STANDARD'
}

/** AddressNames */
export type AddressNameField = {
  __typename?: 'AddressNameField';
  address: Scalars['String'];
  cachedNft?: Maybe<CachedNftField>;
  capitalisation: Scalars['String'];
  created: Scalars['DateTime'];
  expires: Scalars['Int'];
  id: Scalars['String'];
  name: Scalars['String'];
  nftIndex: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type AddressSetInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  newAddress: Scalars['String'];
  nftIndex: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type AllAtomicOrderBookStatsField = {
  __typename?: 'AllAtomicOrderBookStatsField';
  allTimeStats?: Maybe<AtomicOrderBookStatsField>;
  dayStats?: Maybe<AtomicOrderBookStatsField>;
  previousDayStats?: Maybe<AtomicOrderBookStatsField>;
  previousWeekStats?: Maybe<AtomicOrderBookStatsField>;
  weekStats?: Maybe<AtomicOrderBookStatsField>;
};

export type AllAtomicOrderbookStatsField = {
  __typename?: 'AllAtomicOrderbookStatsField';
  allTimeStats?: Maybe<AtomicOrderbookStatsField>;
  dayStats?: Maybe<AtomicOrderbookStatsField>;
  previousDayStats?: Maybe<AtomicOrderbookStatsField>;
  previousWeekStats?: Maybe<AtomicOrderbookStatsField>;
  weekStats?: Maybe<AtomicOrderbookStatsField>;
};

export type AllOrderBookStatsField = {
  __typename?: 'AllOrderBookStatsField';
  allTimeStats?: Maybe<OrderBookStatsField>;
  dayStats?: Maybe<OrderBookStatsField>;
  previousDayStats?: Maybe<OrderBookStatsField>;
  previousWeekStats?: Maybe<OrderBookStatsField>;
  weekStats?: Maybe<OrderBookStatsField>;
};

export type AllOrderbookStatsField = {
  __typename?: 'AllOrderbookStatsField';
  allTimeStats?: Maybe<OrderbookStatsField>;
  dayStats?: Maybe<OrderbookStatsField>;
  previousDayStats?: Maybe<OrderbookStatsField>;
  previousWeekStats?: Maybe<OrderbookStatsField>;
  seasonOneStats?: Maybe<OrderbookStatsField>;
  weekStats?: Maybe<OrderbookStatsField>;
};

export type AllStatsField = {
  __typename?: 'AllStatsField';
  allTimeStats?: Maybe<StatsField>;
  dayStats?: Maybe<StatsField>;
  previousDayStats?: Maybe<StatsField>;
  previousWeekStats?: Maybe<StatsField>;
  seasonOneStats?: Maybe<StatsField>;
  weekStats?: Maybe<StatsField>;
};

export type AlphPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type AlphTokenField = {
  __typename?: 'AlphTokenField';
  balance?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type AtomicLiquidityField = {
  __typename?: 'AtomicLiquidityField';
  blockchain: Scalars['String'];
  buyToken?: Maybe<ListingField>;
  buyVolume: Scalars['String'];
  firstTokenAddress: Scalars['String'];
  id: Scalars['Int'];
  orderCount: Scalars['Int'];
  platform: Scalars['String'];
  secondTokenAddress: Scalars['String'];
  sellToken?: Maybe<ListingField>;
  sellVolume: Scalars['String'];
  timestamp: Scalars['Int'];
};

export type AtomicLiquidityFiltersField = {
  firstTokenAddress?: InputMaybe<Scalars['String']>;
  liquidityId?: InputMaybe<Scalars['Int']>;
  orderType?: InputMaybe<Scalars['Boolean']>;
  ownerAddress?: InputMaybe<Scalars['String']>;
  secondTokenAddress?: InputMaybe<Scalars['String']>;
};

export type AtomicLockedVolumeFiltersField = {
  ownerAddress?: InputMaybe<Scalars['String']>;
};

export type AtomicOrderBookPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type AtomicOrderBookStatsField = {
  __typename?: 'AtomicOrderBookStatsField';
  buyVolume: Scalars['String'];
  sellVolume: Scalars['String'];
  swapCount: Scalars['Int'];
};

export type AtomicOrderCreatedField = {
  __typename?: 'AtomicOrderCreatedField';
  buyAmount: Scalars['String'];
  createdAt: Scalars['String'];
  escrowAddress: Scalars['String'];
  firstTokenAddress: Scalars['String'];
  forwardToAddress?: Maybe<Scalars['String']>;
  groupId: Scalars['String'];
  id: Scalars['Int'];
  liquidityId?: Maybe<Scalars['String']>;
  orderType: Scalars['Boolean'];
  ownerAddress: Scalars['String'];
  price: Scalars['String'];
  secondTokenAddress: Scalars['String'];
  sellAmount: Scalars['String'];
  swapChainId: Scalars['String'];
  swapChainIndex: Scalars['String'];
  unsignedBytes: Scalars['String'];
};

export type AtomicOrderFilledField = {
  __typename?: 'AtomicOrderFilledField';
  atomicOrderCreatedId: Scalars['Int'];
  buyDifference?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  isTaker: Scalars['Boolean'];
  sellDifference?: Maybe<Scalars['String']>;
  swapId?: Maybe<Scalars['String']>;
  takerRefundTxId?: Maybe<Scalars['String']>;
};

export type AtomicOrderInput = {
  buyAmount: Scalars['String'];
  escrowAddress: Scalars['String'];
  firstTokenAddress: Scalars['String'];
  forwardToAddress?: InputMaybe<Scalars['String']>;
  groupId: Scalars['String'];
  liquidityId?: InputMaybe<Scalars['Int']>;
  orderType: Scalars['Boolean'];
  ownerAddress: Scalars['String'];
  priceDigits: Scalars['Int'];
  priceZeros: Scalars['Int'];
  secondTokenAddress: Scalars['String'];
  sellAmount: Scalars['String'];
  unsignedBytes: Scalars['String'];
};

export type AtomicOrderQueueField = {
  __typename?: 'AtomicOrderQueueField';
  atomicOrder?: Maybe<OpenAtomicOrderField>;
  atomicOrderCreatedId: Scalars['Int'];
  createdAt: Scalars['String'];
  id: Scalars['Int'];
};

export type AtomicOrderbookStatsField = {
  __typename?: 'AtomicOrderbookStatsField';
  averagePrice: Scalars['Float'];
  buyVolume: Scalars['String'];
  highestPrice: Scalars['Float'];
  sellVolume: Scalars['String'];
  totalSwaps: Scalars['Int'];
};

export type AtomicPriceTimeSeriesField = {
  __typename?: 'AtomicPriceTimeSeriesField';
  averagePrice: Scalars['Float'];
  closePrice: Scalars['Float'];
  maxPrice: Scalars['Float'];
  minPrice: Scalars['Float'];
  openPrice: Scalars['Float'];
  tick: Scalars['DateTime'];
  tokenVolume: Scalars['String'];
};

export type AtomicPriceTimeSeriesFiltersField = {
  end?: InputMaybe<Scalars['DateTime']>;
  firstTokenAddress?: InputMaybe<Scalars['String']>;
  secondTokenAddress?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['DateTime']>;
  tickPeriod?: InputMaybe<TickPeriod>;
  tickPeriodMultiplier?: InputMaybe<Scalars['Int']>;
};

export type AtomicPriceVolumeField = {
  __typename?: 'AtomicPriceVolumeField';
  buyAmount: Scalars['String'];
  buyToken?: Maybe<ListingField>;
  firstTokenAddress: Scalars['String'];
  id: Scalars['String'];
  orderType: Scalars['Boolean'];
  price: Scalars['Float'];
  secondTokenAddress: Scalars['String'];
  sellAmount: Scalars['String'];
  sellToken?: Maybe<ListingField>;
};

export type AtomicPriceVolumeFiltersField = {
  firstTokenAddress?: InputMaybe<Scalars['String']>;
  isLiquidity?: InputMaybe<Scalars['Boolean']>;
  liquidityId?: InputMaybe<Scalars['Int']>;
  orderType?: InputMaybe<Scalars['Boolean']>;
  ownerAddress?: InputMaybe<Scalars['String']>;
  secondTokenAddress?: InputMaybe<Scalars['String']>;
  showExpired?: InputMaybe<Scalars['Boolean']>;
};

export enum AtomicPriceVolumeSort {
  HighestPrice = 'HIGHEST_PRICE',
  LowestPrice = 'LOWEST_PRICE'
}

export type AtomicSwapBlockField = {
  __typename?: 'AtomicSwapBlockField';
  atomicOrderId: Scalars['Int'];
  blockCount: Scalars['Int'];
  createdAt: Scalars['String'];
  fileUrl: Scalars['String'];
  fromTime: Scalars['String'];
  id: Scalars['Int'];
  minutesApart: Scalars['Int'];
};

export type AtomicSwapField = {
  __typename?: 'AtomicSwapField';
  buyAmount: Scalars['String'];
  buyOrderId: Scalars['Int'];
  buyToken?: Maybe<ListingField>;
  buyTxId?: Maybe<Scalars['String']>;
  buyerAddress?: Maybe<Scalars['String']>;
  buyerIsTaker: Scalars['Boolean'];
  createdAt: Scalars['String'];
  firstTokenAddress?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  makerRebateTxId?: Maybe<Scalars['String']>;
  secondTokenAddress?: Maybe<Scalars['String']>;
  sellAmount: Scalars['String'];
  sellOrderId: Scalars['Int'];
  sellToken?: Maybe<ListingField>;
  sellTxId?: Maybe<Scalars['String']>;
  sellerAddress?: Maybe<Scalars['String']>;
  swapId: Scalars['String'];
  /**
   * Fetch the taker refund information for this swap (if any)
   * Returns the filled record where is_taker=true and taker_refund_tx_id is present
   */
  takerRefund?: Maybe<AtomicOrderFilledField>;
};

export type AtomicWalletField = {
  __typename?: 'AtomicWalletField';
  adminAccount: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  ownerAccount: Scalars['String'];
  storageAccount: Scalars['String'];
};

export enum AuthErrorCodes {
  AccountNotAnonymous = 'ACCOUNT_NOT_ANONYMOUS',
  AccountNotFound = 'ACCOUNT_NOT_FOUND',
  AccountNotVerified = 'ACCOUNT_NOT_VERIFIED',
  BsonError = 'BSON_ERROR',
  EmailAlreadyUsed = 'EMAIL_ALREADY_USED',
  EmailDomainBlacklisted = 'EMAIL_DOMAIN_BLACKLISTED',
  EmailNotFound = 'EMAIL_NOT_FOUND',
  ErrorConnectingToDb = 'ERROR_CONNECTING_TO_DB',
  ErrorCreatingProfile = 'ERROR_CREATING_PROFILE',
  ErrorGeneratingToken = 'ERROR_GENERATING_TOKEN',
  ErrorNotifyingSlack = 'ERROR_NOTIFYING_SLACK',
  ErrorSendingEmail = 'ERROR_SENDING_EMAIL',
  GoogleApiErrorDecodingJson = 'GOOGLE_API_ERROR_DECODING_JSON',
  GoogleOAuthParseError = 'GOOGLE_O_AUTH_PARSE_ERROR',
  GoogleOAuthTokenInvalid = 'GOOGLE_O_AUTH_TOKEN_INVALID',
  IntegerRequired = 'INTEGER_REQUIRED',
  InvalidEncoding = 'INVALID_ENCODING',
  InvalidPassword = 'INVALID_PASSWORD',
  InvalidPublicKey = 'INVALID_PUBLIC_KEY',
  InvalidRefreshToken = 'INVALID_REFRESH_TOKEN',
  InvalidResetToken = 'INVALID_RESET_TOKEN',
  InvalidToken = 'INVALID_TOKEN',
  InvalidVerificationToken = 'INVALID_VERIFICATION_TOKEN',
  OrganisationNotFound = 'ORGANISATION_NOT_FOUND',
  PasswordVerificationError = 'PASSWORD_VERIFICATION_ERROR',
  PermissionDenied = 'PERMISSION_DENIED',
  ProfileNotFound = 'PROFILE_NOT_FOUND',
  Unauthenticated = 'UNAUTHENTICATED',
  UnknownError = 'UNKNOWN_ERROR'
}

export type AuthPagination = {
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
};

export enum Blockchain {
  Alephium = 'ALEPHIUM',
  Elrond = 'ELROND',
  Keeta = 'KEETA',
  Solana = 'SOLANA',
  Stacks = 'STACKS'
}

export type BulkCreateAtomicSwapBlockField = {
  __typename?: 'BulkCreateAtomicSwapBlockField';
  createdCount: Scalars['Int'];
  error?: Maybe<OrderBookError>;
  success: Scalars['Boolean'];
};

export type BulkCreateAtomicSwapBlockInput = {
  atomicOrderId: Scalars['Int'];
  blockCount: Scalars['Int'];
  fileUrl: Scalars['String'];
  fromTime: Scalars['String'];
  skipValidation?: Scalars['Boolean'];
};

export type CachedNftField = {
  __typename?: 'CachedNftField';
  attributes?: Maybe<Scalars['String']>;
  badge?: Maybe<Scalars['Int']>;
  blockchain: NftBlockchain;
  collection: Scalars['String'];
  created: Scalars['DateTime'];
  creator?: Maybe<Scalars['String']>;
  earnRate?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  latestTransfer?: Maybe<NftTransferredField>;
  listing?: Maybe<ListingField>;
  name?: Maybe<Scalars['String']>;
  nonce?: Maybe<Scalars['Int']>;
  owners: Array<OwnerField>;
  rank?: Maybe<Scalars['Int']>;
  royalties?: Maybe<Scalars['Float']>;
  score?: Maybe<Scalars['Float']>;
  timestamp: Scalars['Int'];
  url?: Maybe<Scalars['String']>;
};

export type CandyAccountRewardField = {
  __typename?: 'CandyAccountRewardField';
  account: Scalars['String'];
  accountLinkedName?: Maybe<LinkedNameField>;
  bonus: Scalars['Int'];
  currentDayReward: Scalars['Float'];
  currentDayVolume: Scalars['Float'];
  reward: Scalars['Float'];
  volume: Scalars['Float'];
};

export type CandyAccountRewardsFiltersField = {
  account?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  start?: InputMaybe<Scalars['DateTime']>;
  tickPeriod?: InputMaybe<TickPeriod>;
};

export type CapitalisationSetInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  newCapitalisation: Scalars['String'];
  nftIndex: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type ChangePasswordMutation = {
  __typename?: 'ChangePasswordMutation';
  account?: Maybe<AccountField>;
  error?: Maybe<AuthErrorCodes>;
};

export type CollectionCommissionField = {
  __typename?: 'CollectionCommissionField';
  collection: Scalars['String'];
  commission: Scalars['String'];
};

export type CollectionNoncePair = {
  collection: Scalars['String'];
  nonce: Scalars['Int'];
};

export enum ContractVersion {
  DeadrareV1 = 'DEADRARE_V1',
  DeadrareV2 = 'DEADRARE_V2',
  DeadrareV3 = 'DEADRARE_V3'
}

export type CreateAccountMutation = {
  __typename?: 'CreateAccountMutation';
  account?: Maybe<AccountField>;
  error?: Maybe<AuthErrorCodes>;
  tokens?: Maybe<TokenField>;
};

export type CreateAddressSetField = {
  __typename?: 'CreateAddressSetField';
  error?: Maybe<NameServiceError>;
};

export type CreateAtomicOrderCancelledField = {
  __typename?: 'CreateAtomicOrderCancelledField';
  cancelledCount: Scalars['Int'];
  error?: Maybe<OrderBookError>;
  success: Scalars['Boolean'];
};

export type CreateAtomicOrderCancelledInput = {
  orderIds: Array<Scalars['Int']>;
};

export type CreateAtomicOrderField = {
  __typename?: 'CreateAtomicOrderField';
  atomicOrderIds?: Maybe<Array<Scalars['Int']>>;
  createdCount: Scalars['Int'];
  error?: Maybe<OrderBookError>;
  queuedCount: Scalars['Int'];
  success: Scalars['Boolean'];
  validationErrors?: Maybe<Array<Scalars['String']>>;
};

export type CreateAtomicOrderInput = {
  swapChains: Array<Array<AtomicOrderInput>>;
};

export type CreateAtomicWalletInput = {
  adminAccount: Scalars['String'];
  ownerAccount: Scalars['String'];
  storageAccount: Scalars['String'];
};

export type CreateCapitalisationSetField = {
  __typename?: 'CreateCapitalisationSetField';
  error?: Maybe<NameServiceError>;
};

export type CreateFirstTransfersField = {
  __typename?: 'CreateFirstTransfersField';
  error?: Maybe<TransactionError>;
};

export type CreateListingField = {
  __typename?: 'CreateListingField';
  error?: Maybe<ListingError>;
  result?: Maybe<ListingField>;
};

export type CreateListingInput = {
  admin?: InputMaybe<Scalars['String']>;
  blockchain: Blockchain;
  collectionTicker: Scalars['String'];
  contractVersion?: InputMaybe<ContractVersion>;
  decimals?: InputMaybe<Scalars['Int']>;
  description: Scalars['String'];
  discordLink?: InputMaybe<Scalars['String']>;
  imageRatio?: InputMaybe<Scalars['Float']>;
  imageUrl: Scalars['String'];
  launchpad?: InputMaybe<Scalars['String']>;
  mintHashList?: InputMaybe<Scalars['String']>;
  mintPrice?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  platform: Platform;
  slug?: InputMaybe<Scalars['String']>;
  supply?: InputMaybe<Scalars['String']>;
  twitterLink: Scalars['String'];
  websiteLink?: InputMaybe<Scalars['String']>;
  yo?: InputMaybe<Scalars['String']>;
};

export type CreateListingTokenPairField = {
  __typename?: 'CreateListingTokenPairField';
  error?: Maybe<OrderBookError>;
};

export type CreateNameCreatedField = {
  __typename?: 'CreateNameCreatedField';
  error?: Maybe<NameServiceError>;
};

export type CreateNameDeletedField = {
  __typename?: 'CreateNameDeletedField';
  error?: Maybe<NameServiceError>;
};

export type CreateNameRenewedField = {
  __typename?: 'CreateNameRenewedField';
  error?: Maybe<NameServiceError>;
};

export type CreateNftBurnedField = {
  __typename?: 'CreateNftBurnedField';
  error?: Maybe<NftError>;
};

export type CreateNftMintedField = {
  __typename?: 'CreateNftMintedField';
  error?: Maybe<NftError>;
};

export type CreateNftTransferredField = {
  __typename?: 'CreateNftTransferredField';
  error?: Maybe<NftError>;
};

export type CreateNotificationField = {
  __typename?: 'CreateNotificationField';
  error?: Maybe<NotificationError>;
};

export type CreateNotificationPollField = {
  __typename?: 'CreateNotificationPollField';
  error?: Maybe<NotificationError>;
};

export type CreateOfferAcceptedField = {
  __typename?: 'CreateOfferAcceptedField';
  error?: Maybe<TransactionError>;
};

export type CreateOfferCancelledField = {
  __typename?: 'CreateOfferCancelledField';
  error?: Maybe<TransactionError>;
};

export type CreateOfferCreatedField = {
  __typename?: 'CreateOfferCreatedField';
  error?: Maybe<TransactionError>;
};

export type CreateOfferPriceUpdatedField = {
  __typename?: 'CreateOfferPriceUpdatedField';
  error?: Maybe<TransactionError>;
};

export type CreateOrderCancelledField = {
  __typename?: 'CreateOrderCancelledField';
  error?: Maybe<OrderBookError>;
};

export type CreateOrderCreatedField = {
  __typename?: 'CreateOrderCreatedField';
  error?: Maybe<OrderBookError>;
};

export type CreateOrderFilledField = {
  __typename?: 'CreateOrderFilledField';
  error?: Maybe<OrderBookError>;
};

export type CreateOrderUpdatedField = {
  __typename?: 'CreateOrderUpdatedField';
  error?: Maybe<OrderBookError>;
};

export type CreatePlatformCommissionsField = {
  __typename?: 'CreatePlatformCommissionsField';
  error?: Maybe<TransactionError>;
};

export type CreatePricePointRemovedField = {
  __typename?: 'CreatePricePointRemovedField';
  error?: Maybe<OrderBookError>;
};

export type CreatePushConfigField = {
  __typename?: 'CreatePushConfigField';
  error?: Maybe<PushError>;
};

export type CreateReverseAddressDeletedField = {
  __typename?: 'CreateReverseAddressDeletedField';
  error?: Maybe<NameServiceError>;
};

export type CreateReverseAddressSetField = {
  __typename?: 'CreateReverseAddressSetField';
  error?: Maybe<NameServiceError>;
};

export type CreateSalesField = {
  __typename?: 'CreateSalesField';
  error?: Maybe<TransactionError>;
};

export type CreateTokenPairField = {
  __typename?: 'CreateTokenPairField';
  error?: Maybe<OrderBookError>;
};

export type CreateTradePriceChangedsField = {
  __typename?: 'CreateTradePriceChangedsField';
  error?: Maybe<TransactionError>;
};

export type CreateTradeWithdrawnsField = {
  __typename?: 'CreateTradeWithdrawnsField';
  error?: Maybe<TransactionError>;
};

export type CreateTradesField = {
  __typename?: 'CreateTradesField';
  error?: Maybe<TransactionError>;
};

export type CreateUpcomingProjectField = {
  __typename?: 'CreateUpcomingProjectField';
  error?: Maybe<UpcomingError>;
  result?: Maybe<UpcomingProjectField>;
};

/** Create */
export type CreateUpcomingProjectInput = {
  approved: Scalars['Boolean'];
  discordLink?: InputMaybe<Scalars['String']>;
  imageUrl: Scalars['String'];
  isUpdate: Scalars['Boolean'];
  mintDate?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  price?: InputMaybe<Scalars['Float']>;
  showTime: Scalars['Boolean'];
  total?: InputMaybe<Scalars['Int']>;
  twitterLink: Scalars['String'];
  websiteLink?: InputMaybe<Scalars['String']>;
};

export type FirstTransferInput = {
  account: Scalars['String'];
  fundedBy: Scalars['String'];
  transaction: Scalars['String'];
};

/** Layer Weights */
export type LayerWeightField = {
  __typename?: 'LayerWeightField';
  collection: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  layer: Scalars['String'];
  weight: Scalars['Float'];
};

export type LinkedNameField = {
  __typename?: 'LinkedNameField';
  address: Scalars['String'];
  capitalisation: Scalars['String'];
  expires: Scalars['Int'];
  name: Scalars['String'];
};

export type LiquidityField = {
  __typename?: 'LiquidityField';
  blockchain: OrderbookBlockchain;
  buyToken?: Maybe<ListingField>;
  buyVolume: Scalars['String'];
  id: Scalars['String'];
  orderCount: Scalars['Int'];
  platform: OrderbookPlatform;
  sellToken?: Maybe<ListingField>;
  sellVolume: Scalars['String'];
  timestamp: Scalars['Int'];
  tokenPair: Scalars['String'];
};

export type LiquidityFiltersField = {
  creator?: InputMaybe<Scalars['String']>;
  liquidityId?: InputMaybe<Scalars['Int']>;
  orderType?: InputMaybe<Scalars['Int']>;
  tokenPair?: InputMaybe<Scalars['String']>;
};

export type ListAddressNamesField = {
  __typename?: 'ListAddressNamesField';
  count: Scalars['Int'];
  results: Array<AddressNameField>;
};

export type ListAddressNamesFiltersField = {
  address?: InputMaybe<Scalars['String']>;
  orderType?: InputMaybe<Scalars['Int']>;
  tokenPair?: InputMaybe<Scalars['String']>;
};

export enum ListAddressNamesSort {
  AlphabeticalAsc = 'ALPHABETICAL_ASC',
  AlphabeticalDesc = 'ALPHABETICAL_DESC',
  ExpiresAsc = 'EXPIRES_ASC',
  ExpiresDesc = 'EXPIRES_DESC',
  MostRecentAsc = 'MOST_RECENT_ASC',
  MostRecentDesc = 'MOST_RECENT_DESC'
}

export type ListAtomicLiquidityField = {
  __typename?: 'ListAtomicLiquidityField';
  count: Scalars['Int'];
  liquidity: Array<AtomicLiquidityField>;
};

export type ListAtomicPriceVolumeField = {
  __typename?: 'ListAtomicPriceVolumeField';
  count: Scalars['Int'];
  results: Array<AtomicPriceVolumeField>;
};

export type ListAtomicSwapsField = {
  __typename?: 'ListAtomicSwapsField';
  count: Scalars['Int'];
  results: Array<AtomicSwapField>;
};

export type ListAtomicSwapsFiltersField = {
  address?: InputMaybe<Scalars['String']>;
  anyTokenAddress?: InputMaybe<Scalars['String']>;
  firstTokenAddress?: InputMaybe<Scalars['String']>;
  secondTokenAddress?: InputMaybe<Scalars['String']>;
  tokenAddress?: InputMaybe<Scalars['String']>;
};

export enum ListAtomicSwapsSort {
  MostRecent = 'MOST_RECENT'
}

export type ListCachedNftField = {
  __typename?: 'ListCachedNftField';
  count: Scalars['Int'];
  ownerCount: Scalars['Int'];
  results: Array<CachedNftField>;
};

export type ListLiquidityField = {
  __typename?: 'ListLiquidityField';
  count: Scalars['Int'];
  results: Array<LiquidityField>;
};

export type ListListingField = {
  __typename?: 'ListListingField';
  count: Scalars['Int'];
  results: Array<ListingField>;
};

export type ListListingFiltersInput = {
  admin?: InputMaybe<Scalars['String']>;
  arbitrageEnabled?: InputMaybe<Scalars['Boolean']>;
  blockchain?: InputMaybe<Blockchain>;
  childCollections?: InputMaybe<Scalars['Boolean']>;
  hasScraped?: InputMaybe<Scalars['Boolean']>;
  marketplaceApproved?: InputMaybe<Scalars['Boolean']>;
  parentCollections?: InputMaybe<Scalars['Boolean']>;
  platform?: InputMaybe<Platform>;
  raritiesApproved?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
};

export type ListMarketplaceActivityField = {
  __typename?: 'ListMarketplaceActivityField';
  count: Scalars['Int'];
  results: Array<MarketplaceActivityField>;
};

export type ListMarketplaceActivityPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type ListNftAccountCollectionsField = {
  __typename?: 'ListNftAccountCollectionsField';
  count: Scalars['Int'];
  results: Array<NftAccountCollectionField>;
};

export type ListNotificationField = {
  __typename?: 'ListNotificationField';
  count: Scalars['Int'];
  results: Array<NotificationField>;
};

export type ListNotificationPollField = {
  __typename?: 'ListNotificationPollField';
  count: Scalars['Int'];
  results: Array<NotificationPollField>;
};

export type ListOpenAtomicOrderField = {
  __typename?: 'ListOpenAtomicOrderField';
  count: Scalars['Int'];
  results: Array<OpenAtomicOrderField>;
};

export type ListOpenOffersField = {
  __typename?: 'ListOpenOffersField';
  count: Scalars['Int'];
  results: Array<OpenOfferField>;
};

export type ListOpenOffersPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export enum ListOpenOffersSort {
  HighestPrice = 'HIGHEST_PRICE',
  LowestPrice = 'LOWEST_PRICE',
  MostRecent = 'MOST_RECENT'
}

export type ListOpenOrderField = {
  __typename?: 'ListOpenOrderField';
  count: Scalars['Int'];
  results: Array<OpenOrderField>;
};

export type ListOpenOrderUnlockField = {
  __typename?: 'ListOpenOrderUnlockField';
  count: Scalars['Int'];
  results: Array<Scalars['Int']>;
};

export type ListOpenTradeCollectionsField = {
  __typename?: 'ListOpenTradeCollectionsField';
  count: Scalars['Int'];
  results: Array<OpenTradeCollectionField>;
};

export type ListOwnersField = {
  __typename?: 'ListOwnersField';
  count: Scalars['Int'];
  results: Array<OwnerCountField>;
};

export type ListPriceVolumeField = {
  __typename?: 'ListPriceVolumeField';
  results: Array<PriceVolumeField>;
};

export type ListPushDiscreteConfigField = {
  __typename?: 'ListPushDiscreteConfigField';
  count: Scalars['Int'];
  results: Array<PushDiscreteConfigField>;
};

export type ListSalesField = {
  __typename?: 'ListSalesField';
  count: Scalars['Int'];
  results: Array<SaleField>;
};

export type ListSwapsField = {
  __typename?: 'ListSwapsField';
  count: Scalars['Int'];
  results: Array<SwapField>;
};

export type ListSwapsFiltersField = {
  address?: InputMaybe<Scalars['String']>;
  orderType?: InputMaybe<Scalars['Int']>;
  tokenPair?: InputMaybe<Scalars['String']>;
};

export enum ListSwapsSort {
  MostRecent = 'MOST_RECENT'
}

export type ListTokenPairField = {
  __typename?: 'ListTokenPairField';
  count: Scalars['Int'];
  results: Array<TokenPairField>;
};

export type ListTradesField = {
  __typename?: 'ListTradesField';
  count: Scalars['Int'];
  results: Array<TradeField>;
};

export type ListUnscrapedNftMintsField = {
  __typename?: 'ListUnscrapedNftMintsField';
  results: Array<NftMintedField>;
};

export type ListUpcomingProjectField = {
  __typename?: 'ListUpcomingProjectField';
  count: Scalars['Int'];
  results: Array<UpcomingProjectField>;
};

export enum ListingError {
  AsyncGraphQlError = 'ASYNC_GRAPH_QL_ERROR',
  BsonError = 'BSON_ERROR',
  DataLoaderError = 'DATA_LOADER_ERROR',
  EnumValueNotFound = 'ENUM_VALUE_NOT_FOUND',
  ErrorConnectingToDb = 'ERROR_CONNECTING_TO_DB',
  IntegerRequired = 'INTEGER_REQUIRED',
  InvalidToken = 'INVALID_TOKEN',
  ListingNotFound = 'LISTING_NOT_FOUND',
  ListingRateLimit = 'LISTING_RATE_LIMIT',
  PermissionDenied = 'PERMISSION_DENIED',
  RaritiesValueNotFound = 'RARITIES_VALUE_NOT_FOUND',
  ScrapeKeyError = 'SCRAPE_KEY_ERROR',
  StringRequired = 'STRING_REQUIRED',
  Unauthenticated = 'UNAUTHENTICATED',
  UnknownError = 'UNKNOWN_ERROR'
}

/** Listings */
export type ListingField = {
  __typename?: 'ListingField';
  admin?: Maybe<Scalars['String']>;
  arbitrageEnabled: Scalars['Boolean'];
  blockchain: Blockchain;
  collectionTicker: Scalars['String'];
  contractVersion?: Maybe<ContractVersion>;
  created: Scalars['DateTime'];
  dailyChange?: Maybe<Scalars['Float']>;
  dailyVolume?: Maybe<Scalars['Float']>;
  decimals?: Maybe<Scalars['Int']>;
  description: Scalars['String'];
  discordLink?: Maybe<Scalars['String']>;
  floorPrice?: Maybe<Scalars['Float']>;
  hasScraped: Scalars['Boolean'];
  id: Scalars['ID'];
  imageRatio?: Maybe<Scalars['Float']>;
  imageUrl: Scalars['String'];
  isChildCollection?: Maybe<Scalars['Boolean']>;
  isParentCollection?: Maybe<Scalars['Boolean']>;
  launchpad?: Maybe<Scalars['String']>;
  marketCap: Scalars['Float'];
  marketplaceApproved: Scalars['Boolean'];
  marketplaceApprovedDate?: Maybe<Scalars['DateTime']>;
  mintHashList?: Maybe<Scalars['String']>;
  mintPrice?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  nftCount?: Maybe<Scalars['Int']>;
  orderBookPrice: Scalars['Float'];
  orderBookPriceDailyChange: Scalars['Float'];
  orderBookTvl: Scalars['Float'];
  orderBookTvlDailyChange: Scalars['Float'];
  pixelArt?: Maybe<Scalars['Boolean']>;
  platform: Platform;
  platformCommission?: Maybe<PlatformCommissionField>;
  rank?: Maybe<Scalars['Int']>;
  raritiesApproved: Scalars['Boolean'];
  raritiesApprovedDate?: Maybe<Scalars['DateTime']>;
  showBadges: Scalars['Boolean'];
  slug?: Maybe<Scalars['String']>;
  stats: AllStatsField;
  supply?: Maybe<Scalars['String']>;
  tokenPairs: Array<TokenPairField>;
  totalVolume?: Maybe<Scalars['Float']>;
  twitterLink: Scalars['String'];
  websiteLink?: Maybe<Scalars['String']>;
  weeklyChange?: Maybe<Scalars['Float']>;
  weeklyVolume?: Maybe<Scalars['Float']>;
};


/** Listings */
export type ListingFieldPlatformCommissionArgs = {
  platform: Scalars['String'];
};


/** Listings */
export type ListingFieldTokenPairsArgs = {
  limitPerListing?: InputMaybe<Scalars['Int']>;
};

export type ListingPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export enum ListingSort {
  DailyChange = 'DAILY_CHANGE',
  DateApproved = 'DATE_APPROVED',
  DateCreated = 'DATE_CREATED',
  FloorPrice = 'FLOOR_PRICE',
  HighestDailyVolume = 'HIGHEST_DAILY_VOLUME',
  HighestOrderbookTvl = 'HIGHEST_ORDERBOOK_TVL',
  HighestVolume = 'HIGHEST_VOLUME',
  HighestWeeklyVolume = 'HIGHEST_WEEKLY_VOLUME',
  WeeklyChange = 'WEEKLY_CHANGE'
}

export type ListingTokenPairInput = {
  firstTokenId: Scalars['String'];
  listingId: Scalars['String'];
  secondTokenId: Scalars['String'];
};

export type LockedVolumeFiltersField = {
  creator?: InputMaybe<Scalars['String']>;
  unlock?: InputMaybe<Scalars['Int']>;
};

/** Activity */
export type MarketplaceActivityField = {
  __typename?: 'MarketplaceActivityField';
  activityType: MarketplaceActivityType;
  address: Scalars['String'];
  addressLinkedName?: Maybe<LinkedNameField>;
  blockchain: TransactionBlockchain;
  cachedNft?: Maybe<CachedNftField>;
  collection: Scalars['String'];
  id: Scalars['String'];
  nftId: Scalars['String'];
  platform: TransactionPlatform;
  price: Scalars['String'];
  timestamp: Scalars['Int'];
  transactionId: Scalars['String'];
};

export type MarketplaceActivityFiltersField = {
  address?: InputMaybe<Scalars['String']>;
  blockchain?: InputMaybe<Scalars['String']>;
  collection?: InputMaybe<Scalars['String']>;
  nftId?: InputMaybe<Scalars['String']>;
  platform?: InputMaybe<Scalars['String']>;
};

export enum MarketplaceActivityType {
  OfferAccepted = 'OFFER_ACCEPTED',
  OfferCancelled = 'OFFER_CANCELLED',
  OfferCreated = 'OFFER_CREATED',
  OfferPriceChanged = 'OFFER_PRICE_CHANGED',
  Sale = 'SALE',
  Trade = 'TRADE',
  TradePriceChanged = 'TRADE_PRICE_CHANGED',
  TradeWithdrawn = 'TRADE_WITHDRAWN'
}

export type MatchingImagesField = {
  __typename?: 'MatchingImagesField';
  score?: Maybe<Scalars['Float']>;
  url?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  accountFromGoogle: CreateAccountMutation;
  bulkCreateAtomicSwapBlock: BulkCreateAtomicSwapBlockField;
  changePassword: ChangePasswordMutation;
  createAccount: CreateAccountMutation;
  /** AddressSet */
  createAddressSet: CreateAddressSetField;
  createAtomicOrder: CreateAtomicOrderField;
  createAtomicOrderCancelled: CreateAtomicOrderCancelledField;
  createAtomicWallet: AtomicWalletField;
  /** CapitalisationSet */
  createCapitalisationSet: CreateCapitalisationSetField;
  createFirstTransfers: CreateFirstTransfersField;
  /** Listing */
  createListing: CreateListingField;
  createListingTokenPair: CreateListingTokenPairField;
  /** NameCreated */
  createNameCreated: CreateNameCreatedField;
  /** NameDeleted */
  createNameDeleted: CreateNameDeletedField;
  /** NameRenewed */
  createNameRenewed: CreateNameRenewedField;
  /** NftBurned */
  createNftBurned: CreateNftBurnedField;
  /** NftMinted */
  createNftMinted: CreateNftMintedField;
  /** NftTransferred */
  createNftTransferred: CreateNftTransferredField;
  /** Notification */
  createNotification: CreateNotificationField;
  createNotifications: CreateNotificationField;
  createOfferAccepted: CreateOfferAcceptedField;
  createOfferCancelled: CreateOfferCancelledField;
  createOfferCreated: CreateOfferCreatedField;
  createOfferPriceUpdated: CreateOfferPriceUpdatedField;
  createOrUpdateNotificationPoll: CreateNotificationPollField;
  /** Push */
  createOrUpdatePushConfig: CreatePushConfigField;
  /** OrderCancelled */
  createOrderCancelled: CreateOrderCancelledField;
  /** OrderCreated */
  createOrderCreated: CreateOrderCreatedField;
  /** OrderFilled */
  createOrderFilled: CreateOrderFilledField;
  /** OrderUpdated */
  createOrderUpdated: CreateOrderUpdatedField;
  /** Platform Commissions */
  createPlatformCommissions: CreatePlatformCommissionsField;
  /** PricePointRemoved */
  createPricePointRemoved: CreatePricePointRemovedField;
  createResumableUpload?: Maybe<ResumableUploadField>;
  /** ReverseAddressDeleted */
  createReverseAddressDeleted: CreateReverseAddressDeletedField;
  /** ReverseAddressSet */
  createReverseAddressSet: CreateReverseAddressSetField;
  /** Sale */
  createSales: CreateSalesField;
  createSignedUpload?: Maybe<SignedUploadField>;
  createTokenPair: CreateTokenPairField;
  /** TradePriceChanged */
  createTradePriceChangeds: CreateTradePriceChangedsField;
  /** TradeWithdrawn */
  createTradeWithdrawns: CreateTradeWithdrawnsField;
  /** Trade */
  createTrades: CreateTradesField;
  createUpcomingProject: CreateUpcomingProjectField;
  empty: Scalars['Boolean'];
  newTokens: NewTokensMutation;
  readNotifications: ReadNotificationField;
  refreshAlphListing: Scalars['String'];
  /** Hourly Floor */
  refreshHourlyFloor: RefreshHourlyFloorField;
  refreshNftOwners: RefreshNftOwnersField;
  /** Nft */
  refreshNfts: RefreshNftField;
  refreshTokens: RefreshTokensMutation;
  removeAtomicOrderFromQueue: RemoveAtomicOrderFromQueueField;
  requestPasswordReset: RequestPasswordResetMutation;
  resetPassword: ResetPasswordMutation;
  sendPasswordResetEmail: Scalars['String'];
  sendPushNotifications: SendPushNotificationField;
  setAccountVerified: SetAccountVerifiedMutation;
  updateLayerWeight: UpdateLayerWeightField;
  updateLayerWeights: UpdateLayerWeightsField;
  updateListing: UpdateListingField;
  updateTokenPair: UpdateTokenPairField;
  updateUpcomingProject: UpdateUpcomingProjectField;
  verifyAccount?: Maybe<AuthErrorCodes>;
};


export type MutationAccountFromGoogleArgs = {
  authCode: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationBulkCreateAtomicSwapBlockArgs = {
  input: BulkCreateAtomicSwapBlockInput;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCreateAccountArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateAddressSetArgs = {
  input: Array<AddressSetInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateAtomicOrderArgs = {
  input: CreateAtomicOrderInput;
};


export type MutationCreateAtomicOrderCancelledArgs = {
  input: CreateAtomicOrderCancelledInput;
};


export type MutationCreateAtomicWalletArgs = {
  input: CreateAtomicWalletInput;
};


export type MutationCreateCapitalisationSetArgs = {
  input: Array<CapitalisationSetInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateFirstTransfersArgs = {
  input: Array<FirstTransferInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateListingArgs = {
  input: CreateListingInput;
};


export type MutationCreateListingTokenPairArgs = {
  input: ListingTokenPairInput;
  scrapeKey: Scalars['String'];
};


export type MutationCreateNameCreatedArgs = {
  input: Array<NameCreatedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateNameDeletedArgs = {
  input: Array<NameDeletedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateNameRenewedArgs = {
  input: Array<NameRenewedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateNftBurnedArgs = {
  input: Array<NftBurnedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateNftMintedArgs = {
  input: Array<NftMintedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateNftTransferredArgs = {
  input: Array<NftTransferredInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateNotificationArgs = {
  input: NotificationInput;
};


export type MutationCreateNotificationsArgs = {
  input: Array<NotificationInput>;
};


export type MutationCreateOfferAcceptedArgs = {
  input: Array<OfferAcceptedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateOfferCancelledArgs = {
  input: Array<OfferCancelledInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateOfferCreatedArgs = {
  input: Array<OfferCreatedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateOfferPriceUpdatedArgs = {
  input: Array<OfferPriceUpdatedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateOrUpdateNotificationPollArgs = {
  input: NotificationPollInput;
};


export type MutationCreateOrUpdatePushConfigArgs = {
  input: PushConfigInput;
};


export type MutationCreateOrderCancelledArgs = {
  input: Array<OrderCancelledInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateOrderCreatedArgs = {
  input: Array<OrderCreatedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateOrderFilledArgs = {
  input: Array<OrderFilledInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateOrderUpdatedArgs = {
  input: Array<OrderUpdatedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreatePlatformCommissionsArgs = {
  input: Array<PlatformCommissionInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreatePricePointRemovedArgs = {
  input: Array<PricePointRemovedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateResumableUploadArgs = {
  mimeType: Scalars['String'];
  origin: Scalars['String'];
};


export type MutationCreateReverseAddressDeletedArgs = {
  input: Array<ReverseAddressDeletedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateReverseAddressSetArgs = {
  input: Array<ReverseAddressSetInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateSalesArgs = {
  blockchain: TransactionBlockchain;
  deleteBetween?: InputMaybe<Scalars['Boolean']>;
  input: Array<SaleInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateSignedUploadArgs = {
  mimeType: Scalars['String'];
};


export type MutationCreateTokenPairArgs = {
  input: TokenPairInput;
};


export type MutationCreateTradePriceChangedsArgs = {
  blockchain: TransactionBlockchain;
  deleteBetween?: InputMaybe<Scalars['Boolean']>;
  input: Array<TradePriceChangedInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateTradeWithdrawnsArgs = {
  blockchain: TransactionBlockchain;
  deleteBetween?: InputMaybe<Scalars['Boolean']>;
  input: Array<TradeWithdrawnInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateTradesArgs = {
  blockchain: TransactionBlockchain;
  deleteBetween?: InputMaybe<Scalars['Boolean']>;
  input: Array<TradeInput>;
  scrapeKey: Scalars['String'];
};


export type MutationCreateUpcomingProjectArgs = {
  input: CreateUpcomingProjectInput;
};


export type MutationNewTokensArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationReadNotificationsArgs = {
  address: Scalars['String'];
};


export type MutationRefreshAlphListingArgs = {
  collectionId: Scalars['String'];
};


export type MutationRefreshHourlyFloorArgs = {
  collection: Scalars['String'];
  end?: InputMaybe<Scalars['DateTime']>;
  scrapeKey: Scalars['String'];
  start?: InputMaybe<Scalars['DateTime']>;
};


export type MutationRefreshNftOwnersArgs = {
  input: RefreshNftOwnersInput;
  scrapeKey: Scalars['String'];
};


export type MutationRefreshNftsArgs = {
  input: RefreshNftsInput;
  scrapeKey: Scalars['String'];
};


export type MutationRefreshTokensArgs = {
  refreshToken: Scalars['String'];
};


export type MutationRemoveAtomicOrderFromQueueArgs = {
  input: RemoveAtomicOrderFromQueueInput;
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  resetToken: Scalars['String'];
};


export type MutationSendPasswordResetEmailArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  resetToken: Scalars['String'];
};


export type MutationSendPushNotificationsArgs = {
  input: Array<PushNotificationInput>;
};


export type MutationSetAccountVerifiedArgs = {
  accountId: Scalars['ID'];
  verified: Scalars['Boolean'];
};


export type MutationUpdateLayerWeightArgs = {
  input: UpdateLayerWeightInput;
  layerWeightId: Scalars['ID'];
};


export type MutationUpdateLayerWeightsArgs = {
  input: Array<UpdateLayerWeightInput>;
};


export type MutationUpdateListingArgs = {
  input: UpdateListingInput;
  listingId: Scalars['ID'];
  scrapeKey?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateTokenPairArgs = {
  input: UpdateTokenPairInput;
  scrapeKey: Scalars['String'];
  tokenPairId: Scalars['String'];
};


export type MutationUpdateUpcomingProjectArgs = {
  input: UpdateUpcomingProjectInput;
  upcomingProjectId: Scalars['ID'];
};


export type MutationVerifyAccountArgs = {
  verificationToken: Scalars['String'];
};

export type NameCreatedInput = {
  capitalisation: Scalars['String'];
  creator: Scalars['String'];
  expires: Scalars['Int'];
  id: Scalars['String'];
  name: Scalars['String'];
  nftIndex: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type NameDeletedInput = {
  deleter: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  nftIndex: Scalars['Int'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type NameRenewedInput = {
  expires: Scalars['Int'];
  id: Scalars['String'];
  name: Scalars['String'];
  nftIndex: Scalars['Int'];
  renewer: Scalars['String'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export enum NameServiceError {
  BsonError = 'BSON_ERROR',
  CachedNftsBulkFailed = 'CACHED_NFTS_BULK_FAILED',
  DataLoaderError = 'DATA_LOADER_ERROR',
  EnumValueNotFound = 'ENUM_VALUE_NOT_FOUND',
  ErrorConnectingToDb = 'ERROR_CONNECTING_TO_DB',
  IntegerRequired = 'INTEGER_REQUIRED',
  InvalidToken = 'INVALID_TOKEN',
  PermissionDenied = 'PERMISSION_DENIED',
  ScrapeKeyError = 'SCRAPE_KEY_ERROR',
  StringRequired = 'STRING_REQUIRED',
  TradeNotFound = 'TRADE_NOT_FOUND',
  Unauthenticated = 'UNAUTHENTICATED',
  UnknownError = 'UNKNOWN_ERROR'
}

export type NameServicePagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type NewTokensMutation = {
  __typename?: 'NewTokensMutation';
  error?: Maybe<AuthErrorCodes>;
  tokens?: Maybe<TokenField>;
};

/** Account Collections */
export type NftAccountCollectionField = {
  __typename?: 'NftAccountCollectionField';
  collectionTicker: Scalars['String'];
  listing?: Maybe<ListingField>;
};

export type NftAccountCollectionFiltersField = {
  account: Scalars['String'];
};

export type NftAccountRewardField = {
  __typename?: 'NftAccountRewardField';
  account: Scalars['String'];
  accountLinkedName?: Maybe<LinkedNameField>;
  bonus: Scalars['Int'];
  currentDayReward: Scalars['Float'];
  currentDayVolume: Scalars['Float'];
  reward: Scalars['Float'];
  volume: Scalars['Float'];
};

export enum NftBlockchain {
  Alephium = 'ALEPHIUM',
  Elrond = 'ELROND',
  Stacks = 'STACKS'
}

export type NftBurnedInput = {
  blockHeight: Scalars['Int'];
  blockchain: NftBlockchain;
  burner: Scalars['String'];
  collection: Scalars['String'];
  id: Scalars['String'];
  nftId: Scalars['String'];
  quantity: Scalars['String'];
  status: NftEventStatus;
  txHash: Scalars['String'];
  txIndex: Scalars['Int'];
};

export enum NftError {
  BsonError = 'BSON_ERROR',
  DataLoaderError = 'DATA_LOADER_ERROR',
  EnumValueNotFound = 'ENUM_VALUE_NOT_FOUND',
  ErrorConnectingToDb = 'ERROR_CONNECTING_TO_DB',
  IntegerRequired = 'INTEGER_REQUIRED',
  InvalidToken = 'INVALID_TOKEN',
  LayerWeightIdRequired = 'LAYER_WEIGHT_ID_REQUIRED',
  LayerWeightInsertError = 'LAYER_WEIGHT_INSERT_ERROR',
  LayerWeightNotFound = 'LAYER_WEIGHT_NOT_FOUND',
  PermissionDenied = 'PERMISSION_DENIED',
  ScrapeKeyError = 'SCRAPE_KEY_ERROR',
  StringRequired = 'STRING_REQUIRED',
  Unauthenticated = 'UNAUTHENTICATED',
  UnknownError = 'UNKNOWN_ERROR'
}

export enum NftEventStatus {
  Confirmed = 'CONFIRMED',
  MicroBlock = 'MICRO_BLOCK',
  Pending = 'PENDING'
}

export type NftFiltersField = {
  collection?: InputMaybe<Scalars['String']>;
  collections?: InputMaybe<Array<Scalars['String']>>;
  isBurned?: InputMaybe<Scalars['Boolean']>;
  owner?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
};

export type NftInput = {
  attributes?: InputMaybe<Scalars['String']>;
  badge?: InputMaybe<Scalars['Int']>;
  blockchain: NftBlockchain;
  collection: Scalars['String'];
  creator?: InputMaybe<Scalars['String']>;
  earnRate?: InputMaybe<Scalars['Int']>;
  identifier: Scalars['String'];
  isBurned: Scalars['Boolean'];
  name?: InputMaybe<Scalars['String']>;
  nonce?: InputMaybe<Scalars['Int']>;
  rank?: InputMaybe<Scalars['Int']>;
  royalties?: InputMaybe<Scalars['Float']>;
  score?: InputMaybe<Scalars['Float']>;
  timestamp: Scalars['Int'];
  url?: InputMaybe<Scalars['String']>;
};

/** NftMinted */
export type NftMintedField = {
  __typename?: 'NftMintedField';
  blockHeight: Scalars['Int'];
  blockchain: NftBlockchain;
  collection: Scalars['String'];
  created: Scalars['DateTime'];
  id: Scalars['String'];
  minter: Scalars['String'];
  nftId: Scalars['String'];
  quantity: Scalars['String'];
  status: NftEventStatus;
  txHash: Scalars['String'];
  txIndex: Scalars['Int'];
};

export type NftMintedInput = {
  blockHeight: Scalars['Int'];
  blockchain: NftBlockchain;
  collection: Scalars['String'];
  id: Scalars['String'];
  minter: Scalars['String'];
  nftId: Scalars['String'];
  quantity: Scalars['String'];
  status: NftEventStatus;
  txHash: Scalars['String'];
  txIndex: Scalars['Int'];
};

/** Create */
export type NftOwnerInput = {
  address: Scalars['String'];
  balance: Scalars['String'];
};

export type NftPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export enum NftSort {
  HighestRank = 'HIGHEST_RANK',
  LowestRank = 'LOWEST_RANK',
  Number = 'NUMBER'
}

export type NftTraitInput = {
  traitType: Scalars['String'];
  value: Scalars['String'];
};

/** NftTransferred */
export type NftTransferredField = {
  __typename?: 'NftTransferredField';
  blockHeight: Scalars['Int'];
  blockchain: NftBlockchain;
  collection: Scalars['String'];
  created: Scalars['DateTime'];
  id: Scalars['String'];
  nftId: Scalars['String'];
  quantity: Scalars['String'];
  receiver: Scalars['String'];
  sender: Scalars['String'];
  status: NftEventStatus;
  txHash: Scalars['String'];
  txIndex: Scalars['Int'];
};

export type NftTransferredInput = {
  blockHeight: Scalars['Int'];
  blockchain: NftBlockchain;
  collection: Scalars['String'];
  id: Scalars['String'];
  nftId: Scalars['String'];
  quantity: Scalars['String'];
  receiver: Scalars['String'];
  sender: Scalars['String'];
  status: NftEventStatus;
  txHash: Scalars['String'];
  txIndex: Scalars['Int'];
};

export enum NotificationError {
  BsonError = 'BSON_ERROR',
  CachedNftsBulkFailed = 'CACHED_NFTS_BULK_FAILED',
  DataLoaderError = 'DATA_LOADER_ERROR',
  EnumValueNotFound = 'ENUM_VALUE_NOT_FOUND',
  ErrorConnectingToDb = 'ERROR_CONNECTING_TO_DB',
  IntegerRequired = 'INTEGER_REQUIRED',
  InvalidToken = 'INVALID_TOKEN',
  PermissionDenied = 'PERMISSION_DENIED',
  SendPushNotificationsFailed = 'SEND_PUSH_NOTIFICATIONS_FAILED',
  StringRequired = 'STRING_REQUIRED',
  Unauthenticated = 'UNAUTHENTICATED',
  UnknownError = 'UNKNOWN_ERROR'
}

export enum NotificationEventType {
  FloorPrice = 'FLOOR_PRICE',
  OfferAccept = 'OFFER_ACCEPT',
  OfferMake = 'OFFER_MAKE',
  OfferRefunded = 'OFFER_REFUNDED',
  OfferReject = 'OFFER_REJECT',
  OfferWithdrawn = 'OFFER_WITHDRAWN',
  Sale = 'SALE',
  Unknown = 'UNKNOWN'
}

/** Notification */
export type NotificationField = {
  __typename?: 'NotificationField';
  actionUrl?: Maybe<Scalars['String']>;
  address: Scalars['String'];
  cachedNft?: Maybe<CachedNftField>;
  created: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  eventType: NotificationEventType;
  id: Scalars['Int'];
  nftId?: Maybe<Scalars['String']>;
  offerId?: Maybe<Scalars['String']>;
  priceAmount?: Maybe<Scalars['Float']>;
  readTime?: Maybe<Scalars['DateTime']>;
  saleId?: Maybe<Scalars['String']>;
  timestamp: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
};

export type NotificationFiltersField = {
  address?: InputMaybe<Scalars['String']>;
  eventTypes?: InputMaybe<Array<Scalars['String']>>;
};

export type NotificationInput = {
  actionUrl?: InputMaybe<Scalars['String']>;
  address: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  eventType: NotificationEventType;
  nftId?: InputMaybe<Scalars['String']>;
  offerId?: InputMaybe<Scalars['String']>;
  priceAmount?: InputMaybe<Scalars['Float']>;
  saleId?: InputMaybe<Scalars['String']>;
  timestamp: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};

export type NotificationPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

/** NotificationPoll */
export type NotificationPollField = {
  __typename?: 'NotificationPollField';
  created: Scalars['DateTime'];
  id: Scalars['String'];
  pollTimestamp: Scalars['Int'];
  pollType: NotificationPollType;
};

export type NotificationPollFiltersField = {
  pollTypes?: InputMaybe<Array<Scalars['String']>>;
};

export type NotificationPollInput = {
  pollTimestamp: Scalars['Int'];
  pollType: NotificationPollType;
};

export enum NotificationPollType {
  OfferActions = 'OFFER_ACTIONS',
  Sales = 'SALES',
  Unknown = 'UNKNOWN'
}

export type OfferAcceptedInput = {
  acceptedBy: Scalars['String'];
  blockchain: TransactionBlockchain;
  collection: Scalars['String'];
  epoch: Scalars['Int'];
  id: Scalars['String'];
  nftId: Scalars['String'];
  offerId: Scalars['Int'];
  offerMaker: Scalars['String'];
  platform: TransactionPlatform;
  price: Scalars['String'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type OfferCancelledInput = {
  blockchain: TransactionBlockchain;
  collection: Scalars['String'];
  epoch: Scalars['Int'];
  id: Scalars['String'];
  nftId: Scalars['String'];
  offerId: Scalars['Int'];
  offerMaker: Scalars['String'];
  platform: TransactionPlatform;
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type OfferCreatedInput = {
  blockchain: TransactionBlockchain;
  collection: Scalars['String'];
  epoch: Scalars['Int'];
  id: Scalars['String'];
  nftId: Scalars['String'];
  offerId: Scalars['Int'];
  offerMaker: Scalars['String'];
  platform: TransactionPlatform;
  price: Scalars['String'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type OfferPriceUpdatedInput = {
  blockchain: TransactionBlockchain;
  collection: Scalars['String'];
  epoch: Scalars['Int'];
  id: Scalars['String'];
  newPrice: Scalars['String'];
  nftId: Scalars['String'];
  offerId: Scalars['Int'];
  oldPrice: Scalars['String'];
  platform: TransactionPlatform;
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

/** OG List */
export type OgListItemField = {
  __typename?: 'OgListItemField';
  collection: Scalars['String'];
  firstMintDate: Scalars['DateTime'];
  listing?: Maybe<ListingField>;
};

export type OpenAtomicOrderField = {
  __typename?: 'OpenAtomicOrderField';
  buyAmount: Scalars['String'];
  buyToken?: Maybe<ListingField>;
  createdAt: Scalars['String'];
  escrowAddress: Scalars['String'];
  feeAmount: Scalars['String'];
  firstTokenAddress: Scalars['String'];
  forwardToAddress?: Maybe<Scalars['String']>;
  generatedAt: Scalars['String'];
  groupId: Scalars['String'];
  id: Scalars['Int'];
  liquidityId?: Maybe<Scalars['String']>;
  /**
   * Fetch the oldest valid swap block for this order (if any)
   * Returns the swap block that is currently valid based on from_time and duration
   */
  oldestValidBlock?: Maybe<AtomicSwapBlockField>;
  orderType: Scalars['Boolean'];
  ownerAddress: Scalars['String'];
  price: Scalars['String'];
  secondTokenAddress: Scalars['String'];
  sellAmount: Scalars['String'];
  sellToken?: Maybe<ListingField>;
  swapChainId: Scalars['String'];
  swapChainIndex: Scalars['String'];
  swapChainNext?: Maybe<OpenAtomicOrderField>;
  unsignedBytes: Scalars['String'];
  validUntil: Scalars['String'];
};

export type OpenAtomicOrderFiltersField = {
  /** Filter orders that expire after this timestamp. If None, defaults to current time (Utc::now()) */
  expiresAfter?: InputMaybe<Scalars['DateTime']>;
  firstTokenAddress?: InputMaybe<Scalars['String']>;
  groupId?: InputMaybe<Scalars['String']>;
  isLiquidity?: InputMaybe<Scalars['Boolean']>;
  liquidityId?: InputMaybe<Scalars['Int']>;
  orderType?: InputMaybe<Scalars['Boolean']>;
  ownerAddress?: InputMaybe<Scalars['String']>;
  secondTokenAddress?: InputMaybe<Scalars['String']>;
  /**
   * Filter by expiration status:
   * - null (default): Show all orders (both expired and non-expired)
   * - true: Show only expired orders (swap blocks expired OR orders without blocks created >4:01 ago)
   * - false: Show only non-expired orders ready for execution (valid swap blocks OR orders without blocks created <=4:01 ago)
   */
  showExpired?: InputMaybe<Scalars['Boolean']>;
  swapChainId?: InputMaybe<Scalars['String']>;
};

export enum OpenAtomicOrderSort {
  HighestPrice = 'HIGHEST_PRICE',
  LeastRecent = 'LEAST_RECENT',
  LessRecentExpires = 'LESS_RECENT_EXPIRES',
  LowestPrice = 'LOWEST_PRICE',
  MoreRecentExpires = 'MORE_RECENT_EXPIRES',
  MostRecent = 'MOST_RECENT'
}

/** OpenOffer */
export type OpenOfferField = {
  __typename?: 'OpenOfferField';
  blockchain: TransactionBlockchain;
  cachedNft?: Maybe<CachedNftField>;
  collection: Scalars['String'];
  epoch: Scalars['Int'];
  id: Scalars['String'];
  nftId: Scalars['String'];
  offerId: Scalars['Int'];
  offerMaker: Scalars['String'];
  offerMakerLinkedName?: Maybe<LinkedNameField>;
  platform: TransactionPlatform;
  price: Scalars['String'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type OpenOfferFiltersField = {
  afterTimestamp?: InputMaybe<Scalars['Int']>;
  blockchain?: InputMaybe<TransactionBlockchain>;
  collection?: InputMaybe<Scalars['String']>;
  nftId?: InputMaybe<Scalars['String']>;
  offerId?: InputMaybe<Scalars['Int']>;
  offerMaker?: InputMaybe<Scalars['String']>;
  platform?: InputMaybe<TransactionPlatform>;
};

export type OpenOrderField = {
  __typename?: 'OpenOrderField';
  blockchain: OrderbookBlockchain;
  buyAmount: Scalars['String'];
  buyToken?: Maybe<ListingField>;
  creator: Scalars['String'];
  flipPrice: Scalars['String'];
  id: Scalars['String'];
  orderId: Scalars['Int'];
  orderType: Scalars['Int'];
  platform: OrderbookPlatform;
  price: Scalars['Float'];
  sellAmount: Scalars['String'];
  sellToken?: Maybe<ListingField>;
  startingBuyAmount: Scalars['String'];
  startingSellAmount: Scalars['String'];
  timestamp: Scalars['Int'];
  tokenPair: Scalars['String'];
  unlock: Scalars['Int'];
};

export type OpenOrderFiltersField = {
  blockchain?: InputMaybe<OrderbookBlockchain>;
  creator?: InputMaybe<Scalars['String']>;
  liquidity?: InputMaybe<Scalars['Int']>;
  liquidityId?: InputMaybe<Scalars['Int']>;
  orderType?: InputMaybe<Scalars['Int']>;
  originalOrderId?: InputMaybe<Scalars['Int']>;
  platform?: InputMaybe<OrderbookPlatform>;
  tokenPair?: InputMaybe<Scalars['String']>;
};

export enum OpenOrderSort {
  HighestPrice = 'HIGHEST_PRICE',
  LowestPrice = 'LOWEST_PRICE',
  MostRecent = 'MOST_RECENT'
}

/** Open Trade Collections */
export type OpenTradeCollectionField = {
  __typename?: 'OpenTradeCollectionField';
  collectionTicker: Scalars['String'];
  listing?: Maybe<ListingField>;
};

export type OpenTradeCollectionFiltersField = {
  account: Scalars['String'];
};

export enum OrderBookError {
  AsyncGraphQlError = 'ASYNC_GRAPH_QL_ERROR',
  AtomicOrderNotFound = 'ATOMIC_ORDER_NOT_FOUND',
  AtomicOrderValidationFailed = 'ATOMIC_ORDER_VALIDATION_FAILED',
  BalanceCheckFailed = 'BALANCE_CHECK_FAILED',
  BsonError = 'BSON_ERROR',
  CachedNftsBulkFailed = 'CACHED_NFTS_BULK_FAILED',
  DataLoaderError = 'DATA_LOADER_ERROR',
  EnumValueNotFound = 'ENUM_VALUE_NOT_FOUND',
  ErrorConnectingToDb = 'ERROR_CONNECTING_TO_DB',
  IntegerRequired = 'INTEGER_REQUIRED',
  InvalidToken = 'INVALID_TOKEN',
  KeetaApiInvalidResponse = 'KEETA_API_INVALID_RESPONSE',
  KeetaApiRequestFailed = 'KEETA_API_REQUEST_FAILED',
  KeetaBalanceParseError = 'KEETA_BALANCE_PARSE_ERROR',
  KeetaInsufficientBalance = 'KEETA_INSUFFICIENT_BALANCE',
  KeetaTokenNotFound = 'KEETA_TOKEN_NOT_FOUND',
  OrderMatchingFailed = 'ORDER_MATCHING_FAILED',
  OrderProcessingError = 'ORDER_PROCESSING_ERROR',
  PermissionDenied = 'PERMISSION_DENIED',
  PriceDigitsExceedsMaximum = 'PRICE_DIGITS_EXCEEDS_MAXIMUM',
  ScrapeKeyError = 'SCRAPE_KEY_ERROR',
  StringRequired = 'STRING_REQUIRED',
  SwapChainBrokenLink = 'SWAP_CHAIN_BROKEN_LINK',
  SwapChainLastOrderHasForward = 'SWAP_CHAIN_LAST_ORDER_HAS_FORWARD',
  SwapChainMissingForward = 'SWAP_CHAIN_MISSING_FORWARD',
  SwapChainOrderTypeNotAlternating = 'SWAP_CHAIN_ORDER_TYPE_NOT_ALTERNATING',
  SwapConfirmationFailed = 'SWAP_CONFIRMATION_FAILED',
  TokenPairNotFound = 'TOKEN_PAIR_NOT_FOUND',
  TradeNotFound = 'TRADE_NOT_FOUND',
  Unauthenticated = 'UNAUTHENTICATED',
  UnknownError = 'UNKNOWN_ERROR'
}

export type OrderBookPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type OrderBookStatsField = {
  __typename?: 'OrderBookStatsField';
  buyVolume: Scalars['String'];
  sellVolume: Scalars['String'];
  totalSwaps: Scalars['Int'];
};

export type OrderCancelledInput = {
  blockchain: OrderbookBlockchain;
  caller: Scalars['String'];
  epoch: Scalars['Int'];
  id: Scalars['String'];
  orderId: Scalars['Int'];
  platform: OrderbookPlatform;
  timestamp: Scalars['Int'];
  tokenPair: Scalars['String'];
  txHash: Scalars['String'];
};

export type OrderCreatedInput = {
  blockchain: OrderbookBlockchain;
  buyAmount: Scalars['String'];
  creator: Scalars['String'];
  epoch: Scalars['Int'];
  flipPrice: Scalars['String'];
  id: Scalars['String'];
  liquidityId: Scalars['Int'];
  orderId: Scalars['Int'];
  orderType: Scalars['Int'];
  originalOrderId: Scalars['Int'];
  platform: OrderbookPlatform;
  sellAmount: Scalars['String'];
  timestamp: Scalars['Int'];
  tokenPair: Scalars['String'];
  txHash: Scalars['String'];
  unlock: Scalars['Int'];
};

export type OrderFilledInput = {
  blockchain: OrderbookBlockchain;
  caller: Scalars['String'];
  epoch: Scalars['Int'];
  id: Scalars['String'];
  orderId: Scalars['Int'];
  platform: OrderbookPlatform;
  timestamp: Scalars['Int'];
  tokenPair: Scalars['String'];
  txHash: Scalars['String'];
};

export type OrderUpdatedInput = {
  blockchain: OrderbookBlockchain;
  buyAmount: Scalars['String'];
  creator: Scalars['String'];
  epoch: Scalars['Int'];
  filledBy: Scalars['String'];
  id: Scalars['String'];
  orderId: Scalars['Int'];
  orderType: Scalars['Int'];
  platform: OrderbookPlatform;
  sellAmount: Scalars['String'];
  timestamp: Scalars['Int'];
  tokenPair: Scalars['String'];
  txHash: Scalars['String'];
};

export enum OrderbookBlockchain {
  Alephium = 'ALEPHIUM',
  Elrond = 'ELROND',
  Keeta = 'KEETA'
}

export enum OrderbookPlatform {
  Candyswap = 'CANDYSWAP',
  CandyswapV2 = 'CANDYSWAP_V2',
  CandyswapV3 = 'CANDYSWAP_V3',
  Lightbeam = 'LIGHTBEAM',
  NightshadeV4 = 'NIGHTSHADE_V4'
}

export type OrderbookStatsField = {
  __typename?: 'OrderbookStatsField';
  averagePrice: Scalars['Float'];
  highestPrice: Scalars['Float'];
  totalFees: Scalars['Float'];
  totalSwaps: Scalars['Int'];
  totalVolume: Scalars['Float'];
};

/** Owners */
export type OwnerCountField = {
  __typename?: 'OwnerCountField';
  address: Scalars['String'];
  addressLinkedName?: Maybe<LinkedNameField>;
  count: Scalars['Int'];
};

export type OwnerField = {
  __typename?: 'OwnerField';
  address: Scalars['String'];
  addressLinkedName?: Maybe<LinkedNameField>;
  balance: Scalars['String'];
  created: Scalars['DateTime'];
  id: Scalars['ID'];
  nftId: Scalars['String'];
};

export type OwnerFiltersField = {
  collection: Scalars['String'];
};

export enum Platform {
  Candyswap = 'CANDYSWAP',
  Deadrare = 'DEADRARE',
  Hypelocker = 'HYPELOCKER',
  Lightbeam = 'LIGHTBEAM',
  Mythic = 'MYTHIC',
  NonCustodial = 'NON_CUSTODIAL'
}

/** Platform Commission */
export type PlatformCommissionField = {
  __typename?: 'PlatformCommissionField';
  collection: Scalars['String'];
  commission: Scalars['String'];
  created: Scalars['DateTime'];
  id: Scalars['Int'];
  marketplaceFee: Scalars['String'];
  platform: TransactionPlatform;
  royaltyFee: Scalars['String'];
};

export type PlatformCommissionInput = {
  collection: Scalars['String'];
  commission: Scalars['String'];
  marketplaceFee: Scalars['String'];
  platform: TransactionPlatform;
  royaltyFee: Scalars['String'];
};

export type PricePointRemovedInput = {
  blockchain: OrderbookBlockchain;
  caller: Scalars['String'];
  epoch: Scalars['Int'];
  id: Scalars['String'];
  orderType: Scalars['Int'];
  platform: OrderbookPlatform;
  pricePoint: Scalars['String'];
  timestamp: Scalars['Int'];
  tokenPair: Scalars['String'];
  txHash: Scalars['String'];
};

export type PriceTimeSeriesField = {
  __typename?: 'PriceTimeSeriesField';
  alphVolume: Scalars['String'];
  averagePrice: Scalars['Float'];
  closePrice: Scalars['Float'];
  maxPrice: Scalars['Float'];
  minPrice: Scalars['Float'];
  openPrice: Scalars['Float'];
  tick: Scalars['DateTime'];
};

export type PriceTimeSeriesFiltersField = {
  blockchain?: InputMaybe<OrderbookBlockchain>;
  end?: InputMaybe<Scalars['DateTime']>;
  orderType?: InputMaybe<Scalars['Int']>;
  platform?: InputMaybe<OrderbookPlatform>;
  start?: InputMaybe<Scalars['DateTime']>;
  tickPeriod?: InputMaybe<TickPeriod>;
  tickPeriodMultiplier?: InputMaybe<Scalars['Int']>;
  tokenPair?: InputMaybe<Scalars['String']>;
};

export type PriceVolumeField = {
  __typename?: 'PriceVolumeField';
  buyAmount: Scalars['String'];
  buyToken?: Maybe<ListingField>;
  id: Scalars['String'];
  orderType: Scalars['Int'];
  price: Scalars['Float'];
  sellAmount: Scalars['String'];
  sellToken?: Maybe<ListingField>;
  tokenPair: Scalars['String'];
};

export type PriceVolumeFiltersField = {
  blockchain?: InputMaybe<OrderbookBlockchain>;
  creator?: InputMaybe<Scalars['String']>;
  liquidity?: InputMaybe<Scalars['Int']>;
  liquidityId?: InputMaybe<Scalars['Int']>;
  orderType?: InputMaybe<Scalars['Int']>;
  platform?: InputMaybe<OrderbookPlatform>;
  tokenPair?: InputMaybe<Scalars['String']>;
  unlock?: InputMaybe<Scalars['Int']>;
};

export enum PriceVolumeSort {
  HighestPrice = 'HIGHEST_PRICE',
  LowestPrice = 'LOWEST_PRICE'
}

export type PushConfigFieldFiltersField = {
  active?: InputMaybe<Scalars['Boolean']>;
  addresses?: InputMaybe<Array<Scalars['String']>>;
};

export type PushConfigInput = {
  address: Scalars['String'];
  discordActive: Scalars['Boolean'];
  discordId?: InputMaybe<Scalars['String']>;
};

export type PushConfigPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type PushDiscreteConfigField = {
  __typename?: 'PushDiscreteConfigField';
  address: Scalars['String'];
  created: Scalars['DateTime'];
  discordActive: Scalars['Boolean'];
  id: Scalars['Int'];
};

export enum PushError {
  BsonError = 'BSON_ERROR',
  CachedNftsBulkFailed = 'CACHED_NFTS_BULK_FAILED',
  DataLoaderError = 'DATA_LOADER_ERROR',
  EnumValueNotFound = 'ENUM_VALUE_NOT_FOUND',
  ErrorConnectingToDb = 'ERROR_CONNECTING_TO_DB',
  IntegerRequired = 'INTEGER_REQUIRED',
  InvalidToken = 'INVALID_TOKEN',
  PermissionDenied = 'PERMISSION_DENIED',
  StringRequired = 'STRING_REQUIRED',
  Unauthenticated = 'UNAUTHENTICATED',
  UnknownError = 'UNKNOWN_ERROR'
}

/** PushNotification */
export type PushNotificationInput = {
  actionUrl?: InputMaybe<Scalars['String']>;
  address: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  nftId?: InputMaybe<Scalars['String']>;
  notificationId: Scalars['String'];
  timestamp: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<AccountField>;
  accountByIdBulk: Array<Maybe<AccountField>>;
  atomicOrderBookLastLiquidityId: Scalars['Int'];
  atomicOrderbookStats: AllAtomicOrderbookStatsField;
  atomicPriceTimeSeries: Array<AtomicPriceTimeSeriesField>;
  averageSaleTimeSeries: Array<TimeSeriesField>;
  bulkAtomicOrderBookLockedVolume: Array<Maybe<AtomicOrderBookStatsField>>;
  bulkAtomicOrderBookPrice: Array<Maybe<Scalars['Float']>>;
  bulkAtomicOrderBookStats: Array<AllAtomicOrderBookStatsField>;
  bulkCollectionPlatformCommission: Array<Maybe<PlatformCommissionField>>;
  bulkCollectionStats: Array<AllStatsField>;
  bulkLinkedNamesByAddress: Array<Maybe<LinkedNameField>>;
  bulkOrderBookLockedVolume: Array<Maybe<OrderBookStatsField>>;
  bulkOrderBookPrice: Array<Maybe<Scalars['Float']>>;
  bulkOrderBookStats: Array<AllOrderBookStatsField>;
  bulkPlatformCommission: Array<Maybe<PlatformCommissionField>>;
  cachedNftDetail?: Maybe<CachedNftField>;
  cachedNftsBulk: Array<Maybe<CachedNftField>>;
  cachedNftsByCollectionAndNonceBulk: Array<Maybe<CachedNftField>>;
  candyAccountRewards: Array<CandyAccountRewardField>;
  collectionCountBulk: Array<Maybe<Scalars['Int']>>;
  collectionFromContractId?: Maybe<Scalars['String']>;
  collectionRarities: Array<RarityField>;
  dropById: UpcomingProjectField;
  floorPrice: Scalars['Float'];
  floorTimeSeries: Array<TimeSeriesField>;
  getAtomicOrder?: Maybe<AtomicOrderCreatedField>;
  getAtomicOrderBookLockedVolume?: Maybe<AtomicOrderBookStatsField>;
  getAtomicWalletsByOwnerAccount: Array<AtomicWalletField>;
  getOauthUrl: Scalars['String'];
  getOrderBookLockedVolume?: Maybe<OrderBookStatsField>;
  getTokenPair?: Maybe<TokenPairField>;
  hello?: Maybe<Scalars['String']>;
  helloAuth: Scalars['String'];
  helloEmail: Scalars['String'];
  helloListing: Scalars['String'];
  helloNameService: Scalars['String'];
  helloNft: Scalars['String'];
  helloNotification: Scalars['String'];
  helloOrderBook: Scalars['String'];
  helloPush: Scalars['String'];
  helloTransaction: Scalars['String'];
  helloUpcoming: Scalars['String'];
  helloUpload?: Maybe<Scalars['String']>;
  listAccounts: AccountListField;
  listAddressNames: ListAddressNamesField;
  listAlphAccountTokens?: Maybe<Array<Maybe<AlphTokenField>>>;
  listAtomicOrderBookLiquidity: ListAtomicLiquidityField;
  listAtomicOrderBookSwaps: ListAtomicSwapsField;
  listAtomicOrderPriceVolume: ListAtomicPriceVolumeField;
  listAtomicOrderQueue: Array<AtomicOrderQueueField>;
  listCachedNfts: ListCachedNftField;
  listCollectionCommissions: Array<CollectionCommissionField>;
  listLayerWeights: Array<LayerWeightField>;
  listListings: ListListingField;
  listMarketplaceActivity: ListMarketplaceActivityField;
  listNftAccountCollections: ListNftAccountCollectionsField;
  listNotificationPolls: ListNotificationPollField;
  listNotifications: ListNotificationField;
  listOpenAtomicOrders: ListOpenAtomicOrderField;
  listOpenAtomicOrdersFullChain: ListOpenAtomicOrderField;
  listOpenOffers: ListOpenOffersField;
  listOpenTradeCollections: ListOpenTradeCollectionsField;
  listOrderBookLiquidity: ListLiquidityField;
  listOrderBookOpenOrderUnlocks: ListOpenOrderUnlockField;
  listOrderBookOpenOrders: ListOpenOrderField;
  listOrderBookPriceVolume: ListPriceVolumeField;
  listOrderBookSwaps: ListSwapsField;
  listOwners: ListOwnersField;
  listPushDiscreteConfigs: ListPushDiscreteConfigField;
  listSales: ListSalesField;
  listTokenPairs: ListTokenPairField;
  listTopOffersReceived: ListOpenOffersField;
  listTrades: ListTradesField;
  listUnscrapedNftMints: ListUnscrapedNftMintsField;
  listUpcomingProjects: ListUpcomingProjectField;
  listingDetail?: Maybe<ListingField>;
  listingDetailById?: Maybe<ListingField>;
  listingDetailBySlug?: Maybe<ListingField>;
  listingsBulkByCollection: Array<Maybe<ListingField>>;
  myAccount: AccountField;
  nftAccountRewards: Array<NftAccountRewardField>;
  ogList: Array<OgListItemField>;
  orderBookLastLiquidityId: Scalars['Int'];
  orderbookStats: AllOrderbookStatsField;
  priceTimeSeries: Array<PriceTimeSeriesField>;
  refreshMarketplaceNftOwners: Scalars['Int'];
  refreshRanks: Scalars['Boolean'];
  refreshTradeRanks: Scalars['Int'];
  stats: AllStatsField;
  tokenPairBulk: Array<Maybe<Array<TokenPairField>>>;
  /** Trade */
  tradeByAuctionId?: Maybe<TradeField>;
  volumeTimeSeries: Array<TimeSeriesField>;
  webDetection?: Maybe<WebDetectionField>;
};


export type QueryAccountArgs = {
  accountId: Scalars['ID'];
};


export type QueryAccountByIdBulkArgs = {
  accountIds: Array<Scalars['ID']>;
};


export type QueryAtomicOrderBookLastLiquidityIdArgs = {
  filters?: InputMaybe<AtomicLiquidityFiltersField>;
};


export type QueryAtomicPriceTimeSeriesArgs = {
  filters: AtomicPriceTimeSeriesFiltersField;
};


export type QueryAverageSaleTimeSeriesArgs = {
  filters: TimeSeriesFiltersField;
};


export type QueryBulkAtomicOrderBookLockedVolumeArgs = {
  filters?: InputMaybe<AtomicLockedVolumeFiltersField>;
  firstTokenAddresses: Array<Scalars['String']>;
  secondTokenAddresses: Array<Scalars['String']>;
};


export type QueryBulkAtomicOrderBookPriceArgs = {
  at?: InputMaybe<Scalars['DateTime']>;
  firstTokenAddresses: Array<Scalars['String']>;
  secondTokenAddresses: Array<Scalars['String']>;
};


export type QueryBulkAtomicOrderBookStatsArgs = {
  firstTokenAddresses: Array<Scalars['String']>;
  secondTokenAddresses: Array<Scalars['String']>;
};


export type QueryBulkCollectionPlatformCommissionArgs = {
  collections: Array<Scalars['String']>;
  platform: TransactionPlatform;
};


export type QueryBulkCollectionStatsArgs = {
  collections: Array<Scalars['String']>;
};


export type QueryBulkLinkedNamesByAddressArgs = {
  addresses: Array<Scalars['String']>;
};


export type QueryBulkOrderBookLockedVolumeArgs = {
  filters?: InputMaybe<LockedVolumeFiltersField>;
  tokenPairs: Array<Scalars['String']>;
};


export type QueryBulkOrderBookPriceArgs = {
  at?: InputMaybe<Scalars['DateTime']>;
  tokenPairs: Array<Scalars['String']>;
};


export type QueryBulkOrderBookStatsArgs = {
  tokenPairs: Array<Scalars['String']>;
};


export type QueryBulkPlatformCommissionArgs = {
  platformCommissionIds: Array<Scalars['String']>;
};


export type QueryCachedNftDetailArgs = {
  nftId: Scalars['String'];
};


export type QueryCachedNftsBulkArgs = {
  nftIds: Array<Scalars['ID']>;
};


export type QueryCachedNftsByCollectionAndNonceBulkArgs = {
  collectionNoncePairs: Array<CollectionNoncePair>;
};


export type QueryCandyAccountRewardsArgs = {
  filters: CandyAccountRewardsFiltersField;
  pagination: OrderBookPagination;
};


export type QueryCollectionCountBulkArgs = {
  collections: Array<Scalars['ID']>;
};


export type QueryCollectionFromContractIdArgs = {
  contractId: Scalars['String'];
};


export type QueryCollectionRaritiesArgs = {
  collectionTicker: Scalars['String'];
};


export type QueryDropByIdArgs = {
  dropId: Scalars['ID'];
};


export type QueryFloorPriceArgs = {
  collection: Scalars['String'];
};


export type QueryFloorTimeSeriesArgs = {
  filters: TimeSeriesFiltersField;
};


export type QueryGetAtomicOrderArgs = {
  id: Scalars['String'];
};


export type QueryGetAtomicOrderBookLockedVolumeArgs = {
  filters?: InputMaybe<AtomicLockedVolumeFiltersField>;
  firstTokenAddress: Scalars['String'];
  secondTokenAddress: Scalars['String'];
};


export type QueryGetAtomicWalletsByOwnerAccountArgs = {
  ownerAccount: Scalars['String'];
};


export type QueryGetOauthUrlArgs = {
  redirectUrl: Scalars['String'];
};


export type QueryGetOrderBookLockedVolumeArgs = {
  filters?: InputMaybe<LockedVolumeFiltersField>;
  tokenPair: Scalars['String'];
};


export type QueryGetTokenPairArgs = {
  token1Id: Scalars['String'];
  token2Id: Scalars['String'];
};


export type QueryListAccountsArgs = {
  emailSearch?: InputMaybe<Scalars['String']>;
  pagination?: AuthPagination;
};


export type QueryListAddressNamesArgs = {
  filters: ListAddressNamesFiltersField;
  pagination: NameServicePagination;
  sort: ListAddressNamesSort;
};


export type QueryListAlphAccountTokensArgs = {
  pagination: AlphPagination;
  walletAddress: Scalars['String'];
};


export type QueryListAtomicOrderBookLiquidityArgs = {
  filters: AtomicLiquidityFiltersField;
  pagination: OrderBookPagination;
};


export type QueryListAtomicOrderBookSwapsArgs = {
  filters: ListAtomicSwapsFiltersField;
  pagination: AtomicOrderBookPagination;
  sort: ListAtomicSwapsSort;
};


export type QueryListAtomicOrderPriceVolumeArgs = {
  filters: AtomicPriceVolumeFiltersField;
  pagination: AtomicOrderBookPagination;
  sort: AtomicPriceVolumeSort;
};


export type QueryListCachedNftsArgs = {
  filters: NftFiltersField;
  pagination: NftPagination;
  sort: NftSort;
};


export type QueryListLayerWeightsArgs = {
  collection: Scalars['String'];
};


export type QueryListListingsArgs = {
  filters: ListListingFiltersInput;
  pagination: ListingPagination;
  secondarySort?: InputMaybe<ListingSort>;
  sort: ListingSort;
};


export type QueryListMarketplaceActivityArgs = {
  filters: MarketplaceActivityFiltersField;
  pagination: ListMarketplaceActivityPagination;
};


export type QueryListNftAccountCollectionsArgs = {
  filters: NftAccountCollectionFiltersField;
  pagination: NftPagination;
};


export type QueryListNotificationPollsArgs = {
  filters: NotificationPollFiltersField;
};


export type QueryListNotificationsArgs = {
  filters: NotificationFiltersField;
  pagination: NotificationPagination;
};


export type QueryListOpenAtomicOrdersArgs = {
  filters?: InputMaybe<OpenAtomicOrderFiltersField>;
  pagination: AtomicOrderBookPagination;
  secondarySort?: InputMaybe<OpenAtomicOrderSort>;
  sort?: InputMaybe<OpenAtomicOrderSort>;
};


export type QueryListOpenAtomicOrdersFullChainArgs = {
  filters?: InputMaybe<OpenAtomicOrderFiltersField>;
  pagination: AtomicOrderBookPagination;
  secondarySort?: InputMaybe<OpenAtomicOrderSort>;
  sort?: InputMaybe<OpenAtomicOrderSort>;
};


export type QueryListOpenOffersArgs = {
  filters: OpenOfferFiltersField;
  pagination: ListOpenOffersPagination;
  sort: ListOpenOffersSort;
};


export type QueryListOpenTradeCollectionsArgs = {
  filters: OpenTradeCollectionFiltersField;
  pagination: TradePagination;
};


export type QueryListOrderBookLiquidityArgs = {
  filters: LiquidityFiltersField;
  pagination: OrderBookPagination;
};


export type QueryListOrderBookOpenOrderUnlocksArgs = {
  filters: OpenOrderFiltersField;
  pagination: OrderBookPagination;
};


export type QueryListOrderBookOpenOrdersArgs = {
  filters: OpenOrderFiltersField;
  pagination: OrderBookPagination;
  sort: OpenOrderSort;
};


export type QueryListOrderBookPriceVolumeArgs = {
  filters: PriceVolumeFiltersField;
  pagination: OrderBookPagination;
  sort: PriceVolumeSort;
};


export type QueryListOrderBookSwapsArgs = {
  filters: ListSwapsFiltersField;
  pagination: OrderBookPagination;
  sort: ListSwapsSort;
};


export type QueryListOwnersArgs = {
  filters: OwnerFiltersField;
  pagination: NftPagination;
};


export type QueryListPushDiscreteConfigsArgs = {
  filters: PushConfigFieldFiltersField;
  pagination: PushConfigPagination;
};


export type QueryListSalesArgs = {
  filters: SaleFiltersField;
  pagination: SalePagination;
};


export type QueryListTokenPairsArgs = {
  filters?: InputMaybe<TokenPairFiltersField>;
  pagination: OrderBookPagination;
  sort?: InputMaybe<TokenPairSort>;
};


export type QueryListTopOffersReceivedArgs = {
  filters: TopOffersReceivedFiltersField;
  pagination: ListOpenOffersPagination;
  sort: ListOpenOffersSort;
};


export type QueryListTradesArgs = {
  filters: TradeFiltersField;
  pagination: TradePagination;
  sort: TradeSort;
};


export type QueryListUnscrapedNftMintsArgs = {
  after?: InputMaybe<Scalars['DateTime']>;
  blockchain?: InputMaybe<NftBlockchain>;
  collection?: InputMaybe<Scalars['String']>;
  pagination: NftPagination;
};


export type QueryListUpcomingProjectsArgs = {
  filters: UpcomingProjectFiltersInput;
  pagination: UpcomingProjectPagination;
  sort: UpcomingSort;
};


export type QueryListingDetailArgs = {
  collectionTicker: Scalars['String'];
};


export type QueryListingDetailByIdArgs = {
  listingId: Scalars['ID'];
};


export type QueryListingDetailBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryListingsBulkByCollectionArgs = {
  collections: Array<Scalars['ID']>;
};


export type QueryNftAccountRewardsArgs = {
  filters: TimeSeriesFiltersField;
  pagination: SalePagination;
};


export type QueryOrderBookLastLiquidityIdArgs = {
  filters: LiquidityFiltersField;
};


export type QueryPriceTimeSeriesArgs = {
  filters: PriceTimeSeriesFiltersField;
};


export type QueryRefreshMarketplaceNftOwnersArgs = {
  nftIds: Array<Scalars['String']>;
};


export type QueryRefreshRanksArgs = {
  collectionTicker: Scalars['String'];
  scrapeKey: Scalars['String'];
};


export type QueryRefreshTradeRanksArgs = {
  collection: Scalars['String'];
};


export type QueryStatsArgs = {
  filters: StatsFiltersField;
};


export type QueryTokenPairBulkArgs = {
  limitPerListing?: InputMaybe<Scalars['Int']>;
  listingIds: Array<Scalars['String']>;
};


export type QueryTradeByAuctionIdArgs = {
  auctionId: Scalars['String'];
};


export type QueryVolumeTimeSeriesArgs = {
  filters: TimeSeriesFiltersField;
};


export type QueryWebDetectionArgs = {
  url: Scalars['String'];
};

export type RarityField = {
  __typename?: 'RarityField';
  layer: Scalars['String'];
  traits: Array<TraitCountField>;
};

/** ReadNotification */
export type ReadNotificationField = {
  __typename?: 'ReadNotificationField';
  error?: Maybe<NotificationError>;
};

/** Hourly Floor */
export type RefreshHourlyFloorField = {
  __typename?: 'RefreshHourlyFloorField';
  error?: Maybe<TransactionError>;
};

export type RefreshNftField = {
  __typename?: 'RefreshNftField';
  error?: Maybe<NftError>;
};

export type RefreshNftInput = {
  identifier: Scalars['String'];
  nft?: InputMaybe<NftInput>;
  owners: Array<NftOwnerInput>;
  traits: Array<NftTraitInput>;
};

export type RefreshNftOwnersField = {
  __typename?: 'RefreshNftOwnersField';
  error?: Maybe<NftError>;
};

/** Refresh Nft Owners */
export type RefreshNftOwnersInput = {
  nftIds: Array<Scalars['String']>;
};

export type RefreshNftsInput = {
  nfts: Array<RefreshNftInput>;
};

export type RefreshTokensMutation = {
  __typename?: 'RefreshTokensMutation';
  error?: Maybe<AuthErrorCodes>;
  tokens?: Maybe<TokenField>;
};

export type RemoveAtomicOrderFromQueueField = {
  __typename?: 'RemoveAtomicOrderFromQueueField';
  error?: Maybe<OrderBookError>;
  removedCount: Scalars['Int'];
  success: Scalars['Boolean'];
};

export type RemoveAtomicOrderFromQueueInput = {
  atomicOrderCreatedIds: Array<Scalars['Int']>;
};

export type RequestPasswordResetMutation = {
  __typename?: 'RequestPasswordResetMutation';
  error?: Maybe<AuthErrorCodes>;
};

export type ResetPasswordMutation = {
  __typename?: 'ResetPasswordMutation';
  error?: Maybe<AuthErrorCodes>;
};

export type ResumableUploadField = {
  __typename?: 'ResumableUploadField';
  error?: Maybe<UploadError>;
  name?: Maybe<Scalars['String']>;
  uploadUrl?: Maybe<Scalars['String']>;
};

export type ReverseAddressDeletedInput = {
  address: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

export type ReverseAddressSetInput = {
  address: Scalars['String'];
  id: Scalars['String'];
  newName: Scalars['String'];
  timestamp: Scalars['Int'];
  txHash: Scalars['String'];
};

/** Sale */
export type SaleField = {
  __typename?: 'SaleField';
  acceptedOfferId?: Maybe<Scalars['String']>;
  auctionId?: Maybe<Scalars['String']>;
  blockchain: TransactionBlockchain;
  cachedNft?: Maybe<CachedNftField>;
  collection: Scalars['String'];
  commission?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  from: Scalars['String'];
  fromLinkedName?: Maybe<LinkedNameField>;
  id: Scalars['String'];
  listing?: Maybe<ListingField>;
  marketplaceCut?: Maybe<Scalars['String']>;
  nftId: Scalars['String'];
  nftNonce: Scalars['String'];
  platform?: Maybe<TransactionPlatform>;
  royaltiesCut?: Maybe<Scalars['String']>;
  saleCut?: Maybe<Scalars['String']>;
  salePrice?: Maybe<Scalars['String']>;
  timestamp: Scalars['Int'];
  to: Scalars['String'];
  toLinkedName?: Maybe<LinkedNameField>;
  transactionId: Scalars['String'];
};

export type SaleFiltersField = {
  account?: InputMaybe<Scalars['String']>;
  afterTimestamp?: InputMaybe<Scalars['Int']>;
  blockchain?: InputMaybe<TransactionBlockchain>;
  collection?: InputMaybe<Scalars['String']>;
  nftId?: InputMaybe<Scalars['String']>;
};

export type SaleInput = {
  acceptedOfferId?: InputMaybe<Scalars['String']>;
  auctionId?: InputMaybe<Scalars['String']>;
  blockchain: TransactionBlockchain;
  collection: Scalars['String'];
  commission?: InputMaybe<Scalars['String']>;
  from: Scalars['String'];
  id: Scalars['String'];
  marketplaceCut?: InputMaybe<Scalars['String']>;
  nftId: Scalars['String'];
  nftNonce: Scalars['String'];
  platform?: InputMaybe<TransactionPlatform>;
  royaltiesCut?: InputMaybe<Scalars['String']>;
  saleCut?: InputMaybe<Scalars['String']>;
  salePrice?: InputMaybe<Scalars['String']>;
  timestamp: Scalars['Int'];
  to: Scalars['String'];
  transactionId: Scalars['String'];
};

export type SalePagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type SendPushNotificationField = {
  __typename?: 'SendPushNotificationField';
  error?: Maybe<PushError>;
};

export type SetAccountVerifiedMutation = {
  __typename?: 'SetAccountVerifiedMutation';
  account?: Maybe<AccountField>;
  error?: Maybe<AuthErrorCodes>;
};

export type SignedUploadField = {
  __typename?: 'SignedUploadField';
  name?: Maybe<Scalars['String']>;
  signedUrl?: Maybe<Scalars['String']>;
};

/** Stats */
export type StatsField = {
  __typename?: 'StatsField';
  averagePrice: Scalars['Float'];
  highestPrice: Scalars['Float'];
  totalPrice: Scalars['Float'];
  totalSales: Scalars['Int'];
};

export type StatsFiltersField = {
  account?: InputMaybe<Scalars['String']>;
  blockchain?: InputMaybe<TransactionBlockchain>;
  collection?: InputMaybe<Scalars['String']>;
  nftNonce?: InputMaybe<Scalars['String']>;
};

export type SwapField = {
  __typename?: 'SwapField';
  blockchain: OrderbookBlockchain;
  buyAmount: Scalars['String'];
  buyToken?: Maybe<ListingField>;
  created: Scalars['DateTime'];
  creator: Scalars['String'];
  creatorLinkedName?: Maybe<LinkedNameField>;
  epoch: Scalars['Int'];
  filledBy: Scalars['String'];
  filledByLinkedName?: Maybe<LinkedNameField>;
  id: Scalars['String'];
  orderId: Scalars['Int'];
  orderType: Scalars['Int'];
  platform: OrderbookPlatform;
  sellAmount: Scalars['String'];
  sellToken?: Maybe<ListingField>;
  timestamp: Scalars['Int'];
  tokenPair: Scalars['String'];
  txHash: Scalars['String'];
};

export enum TickPeriod {
  Day = 'DAY',
  Hour = 'HOUR',
  Month = 'MONTH',
  Week = 'WEEK',
  Year = 'YEAR'
}

export type TimeSeriesField = {
  __typename?: 'TimeSeriesField';
  tick: Scalars['DateTime'];
  value: Scalars['Float'];
};

/** Time Series */
export type TimeSeriesFiltersField = {
  blockchain?: InputMaybe<Scalars['String']>;
  collection?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  start?: InputMaybe<Scalars['DateTime']>;
  tickPeriod?: InputMaybe<TickPeriod>;
};

export type TokenField = {
  __typename?: 'TokenField';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type TokenPairField = {
  __typename?: 'TokenPairField';
  alphTvl: Scalars['Float'];
  alphTvlDailyChange: Scalars['Float'];
  arbitrageEnabled: Scalars['Boolean'];
  created: Scalars['DateTime'];
  dailyChange: Scalars['Float'];
  dailyVolume: Scalars['Float'];
  firstToken?: Maybe<ListingField>;
  firstTokenId: Scalars['String'];
  firstTokenTvl: Scalars['String'];
  floorPrice: Scalars['Float'];
  id: Scalars['String'];
  isStable: Scalars['Boolean'];
  latestPrice: Scalars['Float'];
  orderBookLockedVolume?: Maybe<OrderBookStatsField>;
  orderBookPriceAtTime?: Maybe<Scalars['Float']>;
  orderBookStats: AllOrderBookStatsField;
  priceDailyChange: Scalars['Float'];
  secondToken?: Maybe<ListingField>;
  secondTokenId: Scalars['String'];
  secondTokenTvl: Scalars['String'];
  totalVolume: Scalars['Float'];
  weeklyChange: Scalars['Float'];
  weeklyVolume: Scalars['Float'];
};


export type TokenPairFieldOrderBookLockedVolumeArgs = {
  creator?: InputMaybe<Scalars['String']>;
  unlock?: InputMaybe<Scalars['Int']>;
};


export type TokenPairFieldOrderBookPriceAtTimeArgs = {
  at?: InputMaybe<Scalars['DateTime']>;
};

export type TokenPairFiltersField = {
  blockchain?: InputMaybe<Scalars['String']>;
  platform?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
};

export type TokenPairInput = {
  firstTokenId: Scalars['String'];
  id: Scalars['String'];
  listingId: Scalars['String'];
  secondTokenId: Scalars['String'];
};

export enum TokenPairSort {
  AlphTvl = 'ALPH_TVL',
  Created = 'CREATED'
}

export type TokenShortField = {
  __typename?: 'TokenShortField';
  id: Scalars['String'];
  listing?: Maybe<ListingField>;
};

export type TopOffersReceivedFiltersField = {
  afterTimestamp?: InputMaybe<Scalars['Int']>;
  blockchain?: InputMaybe<TransactionBlockchain>;
  collection?: InputMaybe<Scalars['String']>;
  nftId?: InputMaybe<Scalars['String']>;
  offerId?: InputMaybe<Scalars['Int']>;
  offerMaker?: InputMaybe<Scalars['String']>;
  offerReceiver?: InputMaybe<Scalars['String']>;
  platform?: InputMaybe<TransactionPlatform>;
};

/** Trade */
export type TradeField = {
  __typename?: 'TradeField';
  auctionId: Scalars['String'];
  blockchain: TransactionBlockchain;
  cachedNft?: Maybe<CachedNftField>;
  collection: Scalars['String'];
  commission?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  id: Scalars['String'];
  name: Scalars['String'];
  nftId: Scalars['String'];
  nftNonce: Scalars['String'];
  owner: Scalars['String'];
  ownerLinkedName?: Maybe<LinkedNameField>;
  platform?: Maybe<TransactionPlatform>;
  price: Scalars['String'];
  rank?: Maybe<Scalars['Int']>;
  timestamp: Scalars['Int'];
  transactionId: Scalars['String'];
};

export type TradeFiltersField = {
  blockchain?: InputMaybe<TransactionBlockchain>;
  collection?: InputMaybe<Scalars['String']>;
  nftNonce?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  traits: Array<TradeTraitFilterField>;
};

export type TradeInput = {
  attributes?: InputMaybe<Scalars['String']>;
  auctionId: Scalars['String'];
  blockchain: TransactionBlockchain;
  collection: Scalars['String'];
  commission?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  nftId: Scalars['String'];
  nftNonce: Scalars['String'];
  owner: Scalars['String'];
  platform?: InputMaybe<TransactionPlatform>;
  price: Scalars['String'];
  rank?: InputMaybe<Scalars['Int']>;
  timestamp: Scalars['Int'];
  transactionId: Scalars['String'];
};

export type TradePagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type TradePriceChangedInput = {
  auctionId: Scalars['String'];
  blockchain: TransactionBlockchain;
  id: Scalars['String'];
  platform?: InputMaybe<TransactionPlatform>;
  price: Scalars['String'];
  timestamp: Scalars['Int'];
  transactionId: Scalars['String'];
};

export enum TradeSort {
  HighestPrice = 'HIGHEST_PRICE',
  HighestRank = 'HIGHEST_RANK',
  LowestPrice = 'LOWEST_PRICE',
  LowestRank = 'LOWEST_RANK',
  MostRecent = 'MOST_RECENT'
}

export type TradeTraitFilterField = {
  traitType: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type TradeWithdrawnInput = {
  auctionId: Scalars['String'];
  blockchain: TransactionBlockchain;
  id: Scalars['String'];
  platform?: InputMaybe<TransactionPlatform>;
  timestamp: Scalars['Int'];
  transactionId: Scalars['String'];
};

/** Rarities */
export type TraitCountField = {
  __typename?: 'TraitCountField';
  count: Scalars['Float'];
  key: Scalars['String'];
};

export enum TransactionBlockchain {
  Alephium = 'ALEPHIUM',
  Elrond = 'ELROND',
  Solana = 'SOLANA',
  Stacks = 'STACKS'
}

export enum TransactionError {
  BsonError = 'BSON_ERROR',
  CachedNftsBulkFailed = 'CACHED_NFTS_BULK_FAILED',
  DataLoaderError = 'DATA_LOADER_ERROR',
  EnumValueNotFound = 'ENUM_VALUE_NOT_FOUND',
  ErrorConnectingToDb = 'ERROR_CONNECTING_TO_DB',
  IntegerRequired = 'INTEGER_REQUIRED',
  InvalidToken = 'INVALID_TOKEN',
  PermissionDenied = 'PERMISSION_DENIED',
  ScrapeKeyError = 'SCRAPE_KEY_ERROR',
  StringRequired = 'STRING_REQUIRED',
  TradeNotFound = 'TRADE_NOT_FOUND',
  Unauthenticated = 'UNAUTHENTICATED',
  UnknownError = 'UNKNOWN_ERROR'
}

export enum TransactionPlatform {
  Candyswap = 'CANDYSWAP',
  Deadrare = 'DEADRARE',
  DeadrareV2 = 'DEADRARE_V2',
  Gamma = 'GAMMA',
  Mythic = 'MYTHIC',
  Xoxno = 'XOXNO'
}

export enum UpcomingError {
  BsonError = 'BSON_ERROR',
  DataLoaderError = 'DATA_LOADER_ERROR',
  EnumValueNotFound = 'ENUM_VALUE_NOT_FOUND',
  ErrorConnectingToDb = 'ERROR_CONNECTING_TO_DB',
  IntegerRequired = 'INTEGER_REQUIRED',
  InvalidToken = 'INVALID_TOKEN',
  PermissionDenied = 'PERMISSION_DENIED',
  StringRequired = 'STRING_REQUIRED',
  Unauthenticated = 'UNAUTHENTICATED',
  UnknownError = 'UNKNOWN_ERROR',
  UpcomingProjectNotFound = 'UPCOMING_PROJECT_NOT_FOUND',
  UpcomingProjectRateLimit = 'UPCOMING_PROJECT_RATE_LIMIT'
}

export type UpcomingProjectField = {
  __typename?: 'UpcomingProjectField';
  approved: Scalars['Boolean'];
  created: Scalars['DateTime'];
  discordLink?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageUrl: Scalars['String'];
  isUpdate: Scalars['Boolean'];
  mintDate?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  price?: Maybe<Scalars['Float']>;
  showTime: Scalars['Boolean'];
  total?: Maybe<Scalars['Int']>;
  twitterLink: Scalars['String'];
  websiteLink?: Maybe<Scalars['String']>;
};

export type UpcomingProjectFiltersInput = {
  accountId?: InputMaybe<Scalars['String']>;
  approved?: InputMaybe<Scalars['Boolean']>;
};

export type UpcomingProjectPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export enum UpcomingSort {
  Created = 'CREATED',
  MintDate = 'MINT_DATE'
}

export type UpdateLayerWeightField = {
  __typename?: 'UpdateLayerWeightField';
  error?: Maybe<NftError>;
  result?: Maybe<LayerWeightField>;
};

export type UpdateLayerWeightInput = {
  collection?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  layer?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['Float']>;
};

export type UpdateLayerWeightsField = {
  __typename?: 'UpdateLayerWeightsField';
  error?: Maybe<NftError>;
};

export type UpdateListingField = {
  __typename?: 'UpdateListingField';
  error?: Maybe<ListingError>;
  result?: Maybe<ListingField>;
};

export type UpdateListingInput = {
  admin?: InputMaybe<Scalars['String']>;
  arbitrageEnabled?: InputMaybe<Scalars['Boolean']>;
  blockchain?: InputMaybe<Blockchain>;
  collectionTicker?: InputMaybe<Scalars['String']>;
  contractVersion?: InputMaybe<ContractVersion>;
  dailyChange?: InputMaybe<Scalars['Float']>;
  dailyVolume?: InputMaybe<Scalars['Float']>;
  decimals?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  discordLink?: InputMaybe<Scalars['String']>;
  floorPrice?: InputMaybe<Scalars['Float']>;
  hasScraped?: InputMaybe<Scalars['Boolean']>;
  imageRatio?: InputMaybe<Scalars['Float']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  isChildCollection?: InputMaybe<Scalars['Boolean']>;
  isParentCollection?: InputMaybe<Scalars['Boolean']>;
  launchpad?: InputMaybe<Scalars['String']>;
  marketCap?: InputMaybe<Scalars['Float']>;
  marketplaceApproved?: InputMaybe<Scalars['Boolean']>;
  marketplaceApprovedDate?: InputMaybe<Scalars['DateTime']>;
  mintHashList?: InputMaybe<Scalars['String']>;
  mintPrice?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  orderBookPrice?: InputMaybe<Scalars['Float']>;
  orderBookPriceDailyChange?: InputMaybe<Scalars['Float']>;
  orderBookTvl?: InputMaybe<Scalars['Float']>;
  orderBookTvlDailyChange?: InputMaybe<Scalars['Float']>;
  platform?: InputMaybe<Platform>;
  rank?: InputMaybe<Scalars['Int']>;
  raritiesApproved?: InputMaybe<Scalars['Boolean']>;
  raritiesApprovedDate?: InputMaybe<Scalars['DateTime']>;
  showBadges?: InputMaybe<Scalars['Boolean']>;
  slug?: InputMaybe<Scalars['String']>;
  supply?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['Float']>;
  twitterLink?: InputMaybe<Scalars['String']>;
  websiteLink?: InputMaybe<Scalars['String']>;
  weeklyChange?: InputMaybe<Scalars['Float']>;
  weeklyVolume?: InputMaybe<Scalars['Float']>;
};

export type UpdateTokenPairField = {
  __typename?: 'UpdateTokenPairField';
  error?: Maybe<OrderBookError>;
};

export type UpdateTokenPairInput = {
  alphTvl?: InputMaybe<Scalars['Float']>;
  alphTvlDailyChange?: InputMaybe<Scalars['Float']>;
  arbitrageEnabled?: InputMaybe<Scalars['Boolean']>;
  dailyChange?: InputMaybe<Scalars['Float']>;
  dailyVolume?: InputMaybe<Scalars['Float']>;
  firstTokenTvl?: InputMaybe<Scalars['String']>;
  floorPrice?: InputMaybe<Scalars['Float']>;
  isStable?: InputMaybe<Scalars['Boolean']>;
  latestPrice?: InputMaybe<Scalars['Float']>;
  priceDailyChange?: InputMaybe<Scalars['Float']>;
  secondTokenTvl?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['Float']>;
  weeklyChange?: InputMaybe<Scalars['Float']>;
  weeklyVolume?: InputMaybe<Scalars['Float']>;
};

export type UpdateUpcomingProjectField = {
  __typename?: 'UpdateUpcomingProjectField';
  error?: Maybe<UpcomingError>;
  result?: Maybe<UpcomingProjectField>;
};

export type UpdateUpcomingProjectInput = {
  approved?: InputMaybe<Scalars['Boolean']>;
  discordLink?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  isUpdate?: InputMaybe<Scalars['Boolean']>;
  mintDate?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  showTime?: InputMaybe<Scalars['Boolean']>;
  total?: InputMaybe<Scalars['Int']>;
  twitterLink?: InputMaybe<Scalars['String']>;
  websiteLink?: InputMaybe<Scalars['String']>;
};

export enum UploadError {
  OriginNotAllowed = 'ORIGIN_NOT_ALLOWED'
}

export type WebDetectionField = {
  __typename?: 'WebDetectionField';
  fullMatchingImages?: Maybe<Array<Maybe<MatchingImagesField>>>;
  partialMatchingImages?: Maybe<Array<Maybe<MatchingImagesField>>>;
  visuallySimilarImages?: Maybe<Array<Maybe<MatchingImagesField>>>;
};
