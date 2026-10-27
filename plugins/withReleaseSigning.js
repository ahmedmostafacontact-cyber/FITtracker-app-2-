const {withAppBuildGradle}=require('expo/config-plugins');
module.exports=config=>withAppBuildGradle(config,mod=>{
 const marker='// FitLog private release signing';
 if(!mod.modResults.contents.includes(marker))mod.modResults.contents+=`\n${marker}
if (System.getenv('FITLOG_KEYSTORE_PATH')) {
    android.signingConfigs {
        fitlogRelease {
            storeFile file(System.getenv('FITLOG_KEYSTORE_PATH'))
            storePassword file(System.getenv('FITLOG_KEYSTORE_PASSWORD_FILE')).text.trim()
            keyAlias 'fitlog'
            keyPassword file(System.getenv('FITLOG_KEYSTORE_PASSWORD_FILE')).text.trim()
        }
    }
    android.buildTypes.release.signingConfig = android.signingConfigs.fitlogRelease
}
`;
 return mod;
});
