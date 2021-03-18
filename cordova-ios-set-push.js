/**
 * Settings System Capabilities in peoject file for ios push
 * Credit to IONIC: https://github.com/ionic-team/ionic-package-hooks/blob/master/ios_disable_bitcode.js
 * Credit to Quintonn: https://stackoverflow.com/questions/45925548/unable-to-add-push-notifications-entitlement-to-ios-production-with-cordova-plug
 */



module.exports = function (context)
{
      if (!context.opts.platforms || !context.opts.platforms.includes('ios')) {
          return;
      }
        
      var deferral = require('q').defer();
    
      var fs = require('fs');
      var xcode = require('xcode');
      var path = require('path');
      var common = require('cordova-common');
      
      var rootPath = context.opts.projectRoot;
      var configXmlPath = path.join(rootPath, 'config.xml');
      
      var configParser = new common.ConfigParser(configXmlPath);
      var appName = configParser.name();
        
      var projectPath = './platforms/ios/' + appName + '.xcodeproj/project.pbxproj';
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
