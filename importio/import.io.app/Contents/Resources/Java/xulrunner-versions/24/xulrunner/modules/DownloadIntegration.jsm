/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80 filetype=javascript: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Provides functions to integrate with the host application, handling for
 * example the global prompts on shutdown.
 */

"use strict";

this.EXPORTED_SYMBOLS = [
  "DownloadIntegration",
];

////////////////////////////////////////////////////////////////////////////////
//// Globals

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cr = Components.results;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "Services",
                                  "resource://gre/modules/Services.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "Task",
                                  "resource://gre/modules/Task.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "OS",
                                  "resource://gre/modules/osfile.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "FileUtils",
                                  "resource://gre/modules/FileUtils.jsm");
XPCOMUtils.defineLazyServiceGetter(this, "env",
                                   "@mozilla.org/process/environment;1",
                                   "nsIEnvironment");
XPCOMUtils.defineLazyGetter(this, "gStringBundle", function() {
  return Services.strings.
    createBundle("chrome://mozapps/locale/downloads/downloads.properties");
});

////////////////////////////////////////////////////////////////////////////////
//// DownloadIntegration

/**
 * Provides functions to integrate with the host application, handling for
 * example the global prompts on shutdown.
 */
this.DownloadIntegration = {
  // For testing only
  testMode: false,

  /**
   * Returns the system downloads directory asynchronously.
   *
   * @return {Promise}
   * @resolves The nsIFile of downloads directory.
   */
  getSystemDownloadsDirectory: function DI_getSystemDownloadsDirectory() {
    return Task.spawn(function() {
      if (this._downloadsDirectory) {
        // This explicitly makes this function a generator for Task.jsm. We
        // need this because calls to the "yield" operator below may be
        // preprocessed out on some platforms.
        yield;
        throw new Task.Result(this._downloadsDirectory);
      }

      let directory = null;
//@line 73 "/Users/mjgp2/gecko-dev/toolkit/components/jsdownloads/src/DownloadIntegration.jsm"
      directory = this._getDirectory("DfltDwnld");
//@line 112 "/Users/mjgp2/gecko-dev/toolkit/components/jsdownloads/src/DownloadIntegration.jsm"
      this._downloadsDirectory = directory;
      throw new Task.Result(this._downloadsDirectory);
    }.bind(this));
  },
  _downloadsDirectory: null,

  /**
   * Returns the user downloads directory asynchronously.
   *
   * @return {Promise}
   * @resolves The nsIFile of downloads directory.
   */
  getUserDownloadsDirectory: function DI_getUserDownloadsDirectory() {
    return Task.spawn(function() {
      let directory = null;
      let prefValue = 1;

      try {
        prefValue = Services.prefs.getIntPref("browser.download.folderList");
      } catch(e) {}

      switch(prefValue) {
        case 0: // Desktop
          directory = this._getDirectory("Desk");
          break;
        case 1: // Downloads
          directory = yield this.getSystemDownloadsDirectory();
          break;
        case 2: // Custom
          try {
            directory = Services.prefs.getComplexValue("browser.download.dir",
                                                       Ci.nsIFile);
            yield OS.File.makeDir(directory.path, { ignoreExisting: true });

          } catch(ex) {
            // Either the preference isn't set or the directory cannot be created.
            directory = yield this.getSystemDownloadsDirectory();
          }
          break;
        default:
          directory = yield this.getSystemDownloadsDirectory();
      }
      throw new Task.Result(directory);
    }.bind(this));
  },

  /**
   * Returns the temporary downloads directory asynchronously.
   *
   * @return {Promise}
   * @resolves The nsIFile of downloads directory.
   */
  getTemporaryDownloadsDirectory: function DI_getTemporaryDownloadsDirectory() {
    return Task.spawn(function() {
      let directory = null;
//@line 168 "/Users/mjgp2/gecko-dev/toolkit/components/jsdownloads/src/DownloadIntegration.jsm"
      directory = yield this.getUserDownloadsDirectory();
//@line 180 "/Users/mjgp2/gecko-dev/toolkit/components/jsdownloads/src/DownloadIntegration.jsm"
      throw new Task.Result(directory);
    }.bind(this));
  },

  /**
   * Determines whether it's a Windows Metro app.
   */
  _isImmersiveProcess: function() {
    // TODO: to be implemented
    return false;
  },

  /**
   * Calls the directory service, create a downloads directory and returns an
   * nsIFile for the downloads directory.
   *
   * @return {Promise}
   * @resolves The nsIFile directory.
   */
  _createDownloadsDirectory: function DI_createDownloadsDirectory(aName) {
    let directory = this._getDirectory(aName);
    directory.append(gStringBundle.GetStringFromName("downloadsFolder"));

    // Create the Downloads folder and ignore if it already exists.
    return OS.File.makeDir(directory.path, { ignoreExisting: true }).
             then(function() {
               return directory;
             });
  },

  /**
   * Calls the directory service and returns an nsIFile for the requested
   * location name.
   *
   * @return The nsIFile directory.
   */
  _getDirectory: function DI_getDirectory(aName) {
    return Services.dirsvc.get(this.testMode ? "TmpD" : aName, Ci.nsIFile);
  }
};
