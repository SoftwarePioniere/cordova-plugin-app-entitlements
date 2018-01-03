/**
 * Settings System Capabilities in peoject file for ios push
 * Credit to IONIC: https://github.com/ionic-team/ionic-package-hooks/blob/master/ios_disable_bitcode.js
 * Credit to Quintonn: https://stackoverflow.com/questions/45925548/unable-to-add-push-notifications-entitlement-to-ios-production-with-cordova-plug
 */

var fs = require('fs');
var xcode = require('xcode');

module.exports = function (ctx)
{
    if (ctx.opts.platforms.indexOf('ios') < 0) {
        return;
      }
    
      var deferral = ctx.requireCordovaModule('q').defer();
      var common = ctx.requireCordovaModule('cordova-common');
      var util = ctx.requireCordovaModule('cordova-lib/src/cordova/util');

      var projectName = new common.ConfigParser(util.projectConfig(util.isCordova())).name();
      var projectPath = './platforms/ios/' + projectName + '.xcodeproj/project.pbxproj';
      var project = xcode.project(projectPath);


      project.parse(function(err) {
        if (err) {
          console.error('cordova-ios-set-push::error');
          console.error(err);
          deferral.reject('xcode could not parse project');
          
        } else{
        
          console.log('cordova-ios-set-push::writing SystemCapabilities');
          
          var pushEntitlement = "{com.apple.Push ={enabled = 1;};}";
          project.addTargetAttribute("SystemCapabilities", pushEntitlement);

          fs.writeFileSync(projectPath, project.writeSync());
          deferral.resolve();
        }
      });
    
      return deferral.promise;
};