function checkSocialMediaAndContacts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange("B2:B" + sheet.getLastRow()).getValues();
  
  for (var i = 0; i < data.length; i++) {
    var url = data[i][0];
    
    if (url) {
      var result = getSocialMediaAndContacts(url);
      sheet.getRange(i + 2, 3, 1, result.length).setValues([result]);
    }
  }
}

function getSocialMediaAndContacts(url) {
  var html = UrlFetchApp.fetch(url).getContentText();
  
  var facebookUrl = extractSocialMediaUrl(html, 'facebook');
  var instagramUrl = extractSocialMediaUrl(html, 'instagram');
  var twitterUrl = extractSocialMediaUrl(html, 'twitter');
  var linkedinUrl = extractSocialMediaUrl(html, 'linkedin');
  
  var email = extractEmail(html);
  var phoneNumber = extractPhoneNumber(html);
  
  return [facebookUrl, instagramUrl, twitterUrl, linkedinUrl, email, phoneNumber];
}

function extractSocialMediaUrl(html, socialMedia) {
  var regex = new RegExp('https:\/\/www\\.' + socialMedia + '\\.com\\/[a-zA-Z0-9.-_\/]+');
  var matches = html.match(regex);
  return matches ? matches[0] : null;
}

function extractEmail(html) {
  var emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  var matches = html.match(emailRegex);
  return matches ? matches[0] : null;
}

function extractPhoneNumber(html) {
  var phoneRegex = /(?:\+1)?\D*\(?(?:(?:502)|(?:859)|(?:270)|(?:364)|(?:606)|(?:859)|(?:736))\)?\D*\d{3}\D*\d{4}/;
  var telLinks = html.match(/<a[^>]*?tel:[^>]*?>(.*?)<\/a>/gi); // Extract tel links

  if (telLinks) {
    for (var i = 0; i < telLinks.length; i++) {
      var phoneNumberMatch = telLinks[i].match(phoneRegex);
      if (phoneNumberMatch) {
        // Filter out potential false positives
        var validPhoneNumber = phoneNumberMatch[0].replace(/\D/g, '');
        if (validPhoneNumber.length >= 10) {
          return validPhoneNumber;
        }
      }
    }
  }

  return null;
}