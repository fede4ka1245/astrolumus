import { useAppSelector } from '../store';

export const useGetUserName = () => {
  return useAppSelector((state) => state?.user.userInfo?.first_name);
};

export const useGetEmail = () => {
  return useAppSelector((state) => state?.user.userInfo.email);
};

export const useGetBirthday = () => {
  return useAppSelector((state) => state?.user.userInfo.birth_date);
};

export const useGetSecondName = () => {
  return useAppSelector((state) => state?.user.userInfo.last_name);
};

export const useGetAvatar = () => {
  return useAppSelector((state) => state?.user.userInfo.avatar);
};

export const useGetIsNavbarActive = () => {
  return useAppSelector((state) => state?.preferences.isNavbarActive);
};

export const useGetIsAppLoading = () => {
  return useAppSelector((state) => state?.preferences.isAppLoading);
};

export const useGetIsAuthenticated = () => {
  return useAppSelector((state) => state?.preferences.isAuthenticated);
};

export const useGetMaps = () => {
  return useAppSelector((state) => state?.horoscopes.maps);
};

export const useGetTargetMapValue = () => {
  return useAppSelector((state) => state?.horoscopes.targetMapValue);
};

export const useGetAppAccess = () => {
  return useAppSelector((state) => state?.preferences.appAccess);
};

export const useGetHoroscopeUserInfo = () => {
  return useAppSelector((state) => state?.horoscopes.horoscopeUserInfo);
};

export const useGetRectification = () => {
  return useAppSelector((state) => state?.rectification);
};

export const useGetCurrentSavedHoroscope = () => {
  return useAppSelector((state) => state?.savedHoroscopes.currentSavedHoroscope);
};

export const useGetDashiChr = () => {
  return useAppSelector((state) => state?.horoscopes.dashiChr);
};

export const useGetDashiVim = () => {
  return useAppSelector((state) => state?.horoscopes.dashiVim);
};

export const useGetIsSnackbarOpen = () => {
  return useAppSelector((state) => state?.preferences.isSnackbarOpen);
};

export const useGetSnackbarText = () => {
  return useAppSelector((state) => state?.preferences.snackbarText);
};

export const useGetAshtakavarga = () => {
  return useAppSelector((state) => state?.horoscopes.ashtakavarga);
};

export const useGetSavedHoroscopeId = () => {
  return useAppSelector((state) => state?.horoscopes.savedHoroscopeId);
};

export const useGetIsDashiChrLoading = () => {
  return useAppSelector((state) => state?.horoscopes.isDashiChrLoading);
};

export const useGetIsDashiVimLoading = () => {
  return useAppSelector((state) => state?.horoscopes.isDashiVimLoading);
};

export const useGetIsAshtakavargaLoading = () => {
  return useAppSelector((state) => state?.horoscopes.isAshtakavargaLoading);
};

export const useGetDashiTable = () => {
  return useAppSelector((state) => state?.varshpahala.dashiTable);
};

export const useGetIsVarshpahalaLoading = () => {
  return useAppSelector((state) => state?.varshpahala.isVarshpahalaLoading);
};

export const useGetYogasTable = () => {
  return useAppSelector((state) => state?.varshpahala.yogasTable);
};

export const useGetYearMasterTable = () => {
  return useAppSelector((state) => state?.varshpahala.yearMasterTable);
};

export const useGetAynamsa = () => {
  return useAppSelector((state) => state?.horoscopeSettings.aynamsa);
};

export const useGetNodeScheme = () => {
  return useAppSelector((state) => state?.horoscopeSettings.nodeScheme);
};

export const useGetArudhasCount = () => {
  return useAppSelector((state) => state?.horoscopeSettings.arudhasCount);
};

export const useGetYearLength = () => {
  return useAppSelector((state) => state?.horoscopeSettings.yearLength);
};

export const useGetCharaKarakCount = () => {
  return useAppSelector((state) => state?.horoscopeSettings.charaKarakCount);
};

export const useGetSavatobhadra = () => {
  return useAppSelector((state) => state?.zones.savatobhadra);
};

export const useGetIsZonesLoading = () => {
  return useAppSelector((state) => state?.zones.isZonesLoading);
};

export const useGetCalanala = () => {
  return useAppSelector((state) => state?.zones.calanala);
};

export const useGetCompass = () => {
  return useAppSelector((state) => state?.zones.compass);
};

export const useGetShani = () => {
  return useAppSelector((state) => state?.zones.shani);
};

export const useGetSudarshana = () => {
  return useAppSelector((state) => state?.zones.sudarshana);
};

export const useGetYearMaster = () => {
  return useAppSelector((state) => state?.varshpahala.yearMaster);
};

export const useGetVarshpahalaDegreeTable = () => {
  return useAppSelector((state) => state?.varshpahala.varshpahalaDegreeTable);
};

export const useGetIsYearPickerActive = () => {
  return useAppSelector((state) => state?.varshpahala.isYearPickerActive);
};

export const useGetVarshpahalaMaps = () => {
  return useAppSelector((state) => state?.varshpahala.varshpahalaMaps);
};

export const useGetDegreeTable = () => {
  return useAppSelector((state) => state?.horoscopes.degreeTable);
};

export const useGetTransitionMaps = () => {
  return useAppSelector((state) => state?.transition.transitionMaps);
};

export const useGetTransitionDegreeTable = () => {
  return useAppSelector((state) => state?.transition.degreeTable);
};

export const useGetTransitionIsDegreeTableLoading = () => {
  return useAppSelector((state) => state?.transition.isDegreeTableLoading);
};

export const useGetIsTransitionTableLoading = () => {
  return useAppSelector((state) => state?.transition.isTransitionTableLoading);
};

export const useGetTransitionTable = () => {
  return useAppSelector((state) => state?.transition.transitionTable);
};

export const useGetTargetPlanets = () => {
  return useAppSelector((state) => state?.transition.targetPlanets);
};

export const useGetTransitionParams = () => {
  return useAppSelector((state) => state?.transition.transitionParams);
};

export const useGetTransitionDate = () => {
  return useAppSelector((state) => state?.transition.transitionDate);
};

export const useGetTransitionTime = () => {
  return useAppSelector((state) => state?.transition.transitionTime);
};

export const useGetIsTransitionMapsActive = () => {
  return useAppSelector((state) => state?.transition.isTransitionMapsActive);
};

export const useGetMapType = () => {
  return useAppSelector((state) => state?.settings.mapType);
};

export const useGetDefaultLocation = () => {
  return useAppSelector((state) => state?.settings?.defaultLocation);
};

export const useGetArudha = () => {
  return useAppSelector((state) => state?.settings.arudha);
};

export const useGetChakrasParams = () => {
  return useAppSelector((state) => state?.zones.chakrasParams);
};

export const useGetIsEarthActive = () => {
  return useAppSelector((state) => state?.settings.isEarthActive);
};

export const useGetIsDegreeTableLoading = () => {
  return useAppSelector((state) => state?.horoscopes.isDegreeTableLoading);
};

export const useGetCurrentHoroscopeId = () => {
  return useAppSelector((state) => state?.horoscopes.currentHoroscopeId);
};

export const useGetHelpersElements = () => {
  return useAppSelector((state) => state?.settings.helpersElements);
};

export const useGetLanguage = () => {
  return useAppSelector((state) => state?.settings.language);
};

export const useGetIsDeepSkyActive = () => {
  return useAppSelector((state) => state?.deepSky.isDeepSkyActive);
};

export const useGetDeepSkyObjects = () => {
  return useAppSelector((state) => state?.deepSky.deepSkyObjects);
};

export const useGetIsDashiChrPeriodLoading = () => {
  return useAppSelector((state) => state?.horoscopes.isDashiChrPeriodLoading);
};

export const useGetHoroscopeAddressInformation = () => {
  return useAppSelector((state) => state?.horoscopes.addressInformation);
};

// @ts-ignore
export const useGetVarshpahalaDate = () => {
  return useAppSelector((state) => state?.varshpahala.varshpahalaDate);
};

// @ts-ignore
export const useGetVarshpahalaMuntkha = () => {
  return useAppSelector((state) => state?.varshpahala.muntkha);
};

// @ts-ignore
export const useGetSavedHoroscopes = () => {
  return useAppSelector((state) => state?.savedHoroscopes.savedHoroscopes);
};

// Domains selectors
export const useGetCurrentDomain = () => {
  return useAppSelector((state) => state?.domains.currentDomain);
};

export const useGetAvailableDomains = () => {
  return useAppSelector((state) => state?.domains.availableDomains);
};

export const useGetDomainsInitialized = () => {
  return useAppSelector((state) => state?.domains.isInitialized);
};
