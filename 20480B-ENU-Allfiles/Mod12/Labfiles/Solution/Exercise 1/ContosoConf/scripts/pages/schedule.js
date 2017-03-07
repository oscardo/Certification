/// <reference path="../_namespace.js" />
/// <reference path="../Object.inherit.js" />
/// <reference path="../HtmlTemplate.js" />
/// <reference path="../LocalStarStorage.js" />
/// <reference path="../datetime.js" />

(function () {

    // Import objects/functions from the conference namespace.
    var HtmlTemplate = conference.HtmlTemplate;
    var LocalStarStorage = conference.LocalStarStorage;
    var parseTimeAsTotalMinutes = conference.parseTimeAsTotalMinutes;


    var ScheduleItem = Object.inherit({

        initialize: function (data, localStarStorage) {
            this.id = data.id;
            this.tracks = data.tracks;
            this.localStarStorage = localStarStorage;

            this.element = this.scheduleItemTemplate.createElement(data);

            if (localStarStorage.isStarred(this.id)) {
                this.element.classList.add(this.starredClass);
            }

            this.initializeElementClass();
            this.initializeElementPosition(data.start, data.end);
            this.addStarClickEventHandler();
        },

        scheduleItemTemplate: HtmlTemplate.create("schedule-item"),

        initializeElementClass: function () {
            if (this.isInTrack(1) && this.isInTrack(2)) {
                this.element.classList.add("both-tracks");
            } else if (this.isInTrack(1)) {
                this.element.classList.add("track-1");
            } else if (this.isInTrack(2)) {
                this.element.classList.add("track-2");
            }
        },

        initializeElementPosition: function (start, end) {
            var startTimeInMinutes = parseTimeAsTotalMinutes(start);
            var endTimeInMinutes = parseTimeAsTotalMinutes(end);
            var pixelsPerMinute = 2;
            var conferenceStartTimeInMinutes = 8 * 60 + 30;
            this.element.style.top = pixelsPerMinute * (startTimeInMinutes - conferenceStartTimeInMinutes) + "px";
            this.element.style.height = pixelsPerMinute * (endTimeInMinutes - startTimeInMinutes) + "px";
        },

        addStarClickEventHandler: function () {
            var starElement = this.element.querySelector(".star");
            starElement.addEventListener("click", this.toggleStar.bind(this), false);
        },

        isInTrack: function (track) {
            return this.tracks.indexOf(track) >= 0;
        },

        starredClass: "starred",

        toggleStar: function () {
            if (this.isStarred()) {
                this.unsetStar();
            } else {
                this.setStar();
            }
        },

        isStarred: function () {
            return this.element.classList.contains(this.starredClass);
        },

        unsetStar: function () {
            this.element.classList.remove(this.starredClass);
            this.postStarChange(false);
            this.localStarStorage.removeStar(this.id);
        },

        setStar: function () {
            this.element.classList.add(this.starredClass);
            this.postStarChange(true);
            this.localStarStorage.addStar(this.id);
        },

        postStarChange: function (isStarred) {
            var request = $.ajax({
                type: "POST",
                url: "/schedule/star/" + this.id,
                data: { starred: isStarred },
                context: this
            });
            request.done(function (responseData) {
                this.updateStarCount(responseData.starCount);
            });
        },

        updateStarCount: function (starCount) {
            var starCountElement = this.element.querySelector(".star-count");
            starCountElement.textContent = starCount.toString();
        },

        show: function () {
            this.element.style.display = "block";
        },

        hide: function () {
            this.element.style.display = "none";
        }
    });


    var ScheduleList = Object.inherit({
        initialize: function (listElement, localStarStorage) {
            this.element = listElement;
            this.localStarStorage = localStarStorage;
            this.items = [];
        },

        startDownload: function () {
            var request = $.ajax({
                url: "/schedule/list",
                context: this
            });
            request.done(this.downloadDone)
                   .fail(this.downloadFailed);
        },

        downloadDone: function (responseData) {
            this.addAll(responseData.schedule);
        },

        downloadFailed: function () {
            alert("Could not retrieve schedule data at this time. Please try again later.");
        },

        addAll: function (itemsArray) {
            itemsArray.forEach(this.add, this);
        },

        add: function (itemData) {
            var item = ScheduleItem.create(itemData, this.localStarStorage);
            this.items.push(item); // Store item object in our array
            this.element.appendChild(item.element); // Also add the item element to the UI.
        }
    });


    var Page = Object.inherit({
        initialize: function () {
            var scheduleListElement = document.getElementById("schedule");
            this.scheduleList = ScheduleList.create(
                scheduleListElement,
                LocalStarStorage.create(localStorage)
            );
            this.scheduleList.startDownload();
        }
    });


    Page.create();

} ());
// SIG // Begin signature block
// SIG // MIIaaAYJKoZIhvcNAQcCoIIaWTCCGlUCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFGafglyTjJMD
// SIG // Wh0XrFi5vVMv17YPoIIVLzCCBJkwggOBoAMCAQICEzMA
// SIG // AACdHo0nrrjz2DgAAQAAAJ0wDQYJKoZIhvcNAQEFBQAw
// SIG // eTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EwHhcNMTIwOTA0
// SIG // MjE0MjA5WhcNMTMwMzA0MjE0MjA5WjCBgzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjENMAsGA1UECxMETU9QUjEeMBwGA1UE
// SIG // AxMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuqRJbBD7Ipxl
// SIG // ohaYO8thYvp0Ka2NBhnScVgZil5XDWlibjagTv0ieeAd
// SIG // xxphjvr8oxElFsjAWCwxioiuMh6I238+dFf3haQ2U8pB
// SIG // 72m4aZ5tVutu5LImTXPRZHG0H9ZhhIgAIe9oWINbSY+0
// SIG // 39M11svZMJ9T/HprmoQrtyFndNT2eLZhh5iUfCrPZ+kZ
// SIG // vtm6Y+08Tj59Auvzf6/PD7eBfvT76PeRSLuPPYzIB5Mc
// SIG // 87115PxjICmfOfNBVDgeVGRAtISqN67zAIziDfqhsg8i
// SIG // taeprtYXuTDwAiMgEPprWQ/grZ+eYIGTA0wNm2IZs7uW
// SIG // vJFapniGdptszUzsErU4RwIDAQABo4IBDTCCAQkwEwYD
// SIG // VR0lBAwwCgYIKwYBBQUHAwMwHQYDVR0OBBYEFN5R3Bvy
// SIG // HkoFPxIcwbzDs2UskQWYMB8GA1UdIwQYMBaAFMsR6MrS
// SIG // tBZYAck3LjMWFrlMmgofMFYGA1UdHwRPME0wS6BJoEeG
// SIG // RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY0NvZFNpZ1BDQV8wOC0zMS0yMDEw
// SIG // LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKG
// SIG // Pmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2Vy
// SIG // dHMvTWljQ29kU2lnUENBXzA4LTMxLTIwMTAuY3J0MA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQAqpPfuwMMmeoNiGnicW8X9
// SIG // 7BXEp3gT0RdTKAsMAEI/OA+J3GQZhDV/SLnP63qJoc1P
// SIG // qeC77UcQ/hfah4kQ0UwVoPAR/9qWz2TPgf0zp8N4k+R8
// SIG // 1W2HcdYcYeLMTmS3cz/5eyc09lI/R0PADoFwU8GWAaJL
// SIG // u78qA3d7bvvQRooXKDGlBeMWirjxSmkVXTP533+UPEdF
// SIG // Ha7Ki8f3iB7q/pEMn08HCe0mkm6zlBkB+F+B567aiY9/
// SIG // Wl6EX7W+fEblR6/+WCuRf4fcRh9RlczDYqG1x1/ryWlc
// SIG // cZGpjVYgLDpOk/2bBo+tivhofju6eUKTOUn10F7scI1C
// SIG // dcWCVZAbtVVhMIIEwzCCA6ugAwIBAgITMwAAACs5MkjB
// SIG // sslI8wAAAAAAKzANBgkqhkiG9w0BAQUFADB3MQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQg
// SIG // VGltZS1TdGFtcCBQQ0EwHhcNMTIwOTA0MjExMjM0WhcN
// SIG // MTMxMjA0MjExMjM0WjCBszELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjENMAsGA1UECxMETU9QUjEnMCUGA1UECxMebkNpcGhl
// SIG // ciBEU0UgRVNOOkMwRjQtMzA4Ni1ERUY4MSUwIwYDVQQD
// SIG // ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIB
// SIG // IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAprYw
// SIG // DgNlrlBahmuFn0ihHsnA7l5JB4XgcJZ8vrlfYl8GJtOL
// SIG // ObsYIqUukq3YS4g6Gq+bg67IXjmMwjJ7FnjtNzg68WL7
// SIG // aIICaOzru0CKsf6hLDZiYHA5YGIO+8YYOG+wktZADYCm
// SIG // DXiLNmuGiiYXGP+w6026uykT5lxIjnBGNib+NDWrNOH3
// SIG // 2thc6pl9MbdNH1frfNaVDWYMHg4yFz4s1YChzuv3mJEC
// SIG // 3MFf/TiA+Dl/XWTKN1w7UVtdhV/OHhz7NL5f5ShVcFSc
// SIG // uOx8AFVGWyiYKFZM4fG6CRmWgUgqMMj3MyBs52nDs9TD
// SIG // Ts8wHjfUmFLUqSNFsq5cQUlPtGJokwIDAQABo4IBCTCC
// SIG // AQUwHQYDVR0OBBYEFKUYM1M/lWChQxbvjsav0iu6nljQ
// SIG // MB8GA1UdIwQYMBaAFCM0+NlSRnAK7UD7dvuzK7DDNbMP
// SIG // MFQGA1UdHwRNMEswSaBHoEWGQ2h0dHA6Ly9jcmwubWlj
// SIG // cm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY3Jv
// SIG // c29mdFRpbWVTdGFtcFBDQS5jcmwwWAYIKwYBBQUHAQEE
// SIG // TDBKMEgGCCsGAQUFBzAChjxodHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NlcnRzL01pY3Jvc29mdFRpbWVT
// SIG // dGFtcFBDQS5jcnQwEwYDVR0lBAwwCgYIKwYBBQUHAwgw
// SIG // DQYJKoZIhvcNAQEFBQADggEBAH7MsHvlL77nVrXPc9uq
// SIG // UtEWOca0zfrX/h5ltedI85tGiAVmaiaGXv6HWNzGY444
// SIG // gPQIRnwrc7EOv0Gqy8eqlKQ38GQ54cXV+c4HzqvkJfBp
// SIG // rtRG4v5mMjzXl8UyIfruGiWgXgxCLBEzOoKD/e0ds77O
// SIG // kaSRJXG5q3Kwnq/kzwBiiXCpuEpQjO4vImSlqOZNa5Us
// SIG // HHnsp6Mx2pBgkKRu/pMCDT8sJA3GaiaBUYNKELt1Y0Sq
// SIG // aQjGA+vizwvtVjrs73KnCgz0ANMiuK8icrPnxJwLKKCA
// SIG // yuPh1zlmMOdGFxjn+oL6WQt6vKgN/hz/A4tjsk0SAiNP
// SIG // LbOFhDvioUfozxUwggW8MIIDpKADAgECAgphMyYaAAAA
// SIG // AAAxMA0GCSqGSIb3DQEBBQUAMF8xEzARBgoJkiaJk/Is
// SIG // ZAEZFgNjb20xGTAXBgoJkiaJk/IsZAEZFgltaWNyb3Nv
// SIG // ZnQxLTArBgNVBAMTJE1pY3Jvc29mdCBSb290IENlcnRp
// SIG // ZmljYXRlIEF1dGhvcml0eTAeFw0xMDA4MzEyMjE5MzJa
// SIG // Fw0yMDA4MzEyMjI5MzJaMHkxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xIzAhBgNVBAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25p
// SIG // bmcgUENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
// SIG // CgKCAQEAsnJZXBkwZL8dmmAgIEKZdlNsPhvWb8zL8epr
// SIG // /pcWEODfOnSDGrcvoDLs/97CQk4j1XIA2zVXConKriBJ
// SIG // 9PBorE1LjaW9eUtxm0cH2v0l3511iM+qc0R/14Hb873y
// SIG // NqTJXEXcr6094CholxqnpXJzVvEXlOT9NZRyoNZ2Xx53
// SIG // RYOFOBbQc1sFumdSjaWyaS/aGQv+knQp4nYvVN0UMFn4
// SIG // 0o1i/cvJX0YxULknE+RAMM9yKRAoIsc3Tj2gMj2QzaE4
// SIG // BoVcTlaCKCoFMrdL109j59ItYvFFPeesCAD2RqGe0VuM
// SIG // JlPoeqpK8kbPNzw4nrR3XKUXno3LEY9WPMGsCV8D0wID
// SIG // AQABo4IBXjCCAVowDwYDVR0TAQH/BAUwAwEB/zAdBgNV
// SIG // HQ4EFgQUyxHoytK0FlgByTcuMxYWuUyaCh8wCwYDVR0P
// SIG // BAQDAgGGMBIGCSsGAQQBgjcVAQQFAgMBAAEwIwYJKwYB
// SIG // BAGCNxUCBBYEFP3RMU7TJoqV4ZhgO6gxb6Y8vNgtMBkG
// SIG // CSsGAQQBgjcUAgQMHgoAUwB1AGIAQwBBMB8GA1UdIwQY
// SIG // MBaAFA6sgmBAVieX5SUT/CrhClOVWeSkMFAGA1UdHwRJ
// SIG // MEcwRaBDoEGGP2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY3JsL3Byb2R1Y3RzL21pY3Jvc29mdHJvb3Rj
// SIG // ZXJ0LmNybDBUBggrBgEFBQcBAQRIMEYwRAYIKwYBBQUH
// SIG // MAKGOGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kv
// SIG // Y2VydHMvTWljcm9zb2Z0Um9vdENlcnQuY3J0MA0GCSqG
// SIG // SIb3DQEBBQUAA4ICAQBZOT5/Jkav629AsTK1ausOL26o
// SIG // SffrX3XtTDst10OtC/7L6S0xoyPMfFCYgCFdrD0vTLqi
// SIG // qFac43C7uLT4ebVJcvc+6kF/yuEMF2nLpZwgLfoLUMRW
// SIG // zS3jStK8cOeoDaIDpVbguIpLV/KVQpzx8+/u44YfNDy4
// SIG // VprwUyOFKqSCHJPilAcd8uJO+IyhyugTpZFOyBvSj3KV
// SIG // KnFtmxr4HPBT1mfMIv9cHc2ijL0nsnljVkSiUc356aNY
// SIG // Vt2bAkVEL1/02q7UgjJu/KSVE+Traeepoiy+yCsQDmWO
// SIG // mdv1ovoSJgllOJTxeh9Ku9HhVujQeJYYXMk1Fl/dkx1J
// SIG // ji2+rTREHO4QFRoAXd01WyHOmMcJ7oUOjE9tDhNOPXwp
// SIG // SJxy0fNsysHscKNXkld9lI2gG0gDWvfPo2cKdKU27S0v
// SIG // F8jmcjcS9G+xPGeC+VKyjTMWZR4Oit0Q3mT0b85G1NMX
// SIG // 6XnEBLTT+yzfH4qerAr7EydAreT54al/RrsHYEdlYEBO
// SIG // sELsTu2zdnnYCjQJbRyAMR/iDlTd5aH75UcQrWSY/1AW
// SIG // Lny/BSF64pVBJ2nDk4+VyY3YmyGuDVyc8KKuhmiDDGot
// SIG // u3ZrAB2WrfIWe/YWgyS5iM9qqEcxL5rc43E91wB+YkfR
// SIG // zojJuBj6DnKNwaM9rwJAav9pm5biEKgQtDdQCNbDPTCC
// SIG // BgcwggPvoAMCAQICCmEWaDQAAAAAABwwDQYJKoZIhvcN
// SIG // AQEFBQAwXzETMBEGCgmSJomT8ixkARkWA2NvbTEZMBcG
// SIG // CgmSJomT8ixkARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMk
// SIG // TWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9y
// SIG // aXR5MB4XDTA3MDQwMzEyNTMwOVoXDTIxMDQwMzEzMDMw
// SIG // OVowdzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMY
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn6Fssd/bSJIq
// SIG // fGsuGeG94uPFmVEjUK3O3RhOJA/u0afRTK10MCAR6wfV
// SIG // VJUVSZQbQpKumFwwJtoAa+h7veyJBw/3DgSY8InMH8sz
// SIG // JIed8vRnHCz8e+eIHernTqOhwSNTyo36Rc8J0F6v0LBC
// SIG // BKL5pmyTZ9co3EZTsIbQ5ShGLieshk9VUgzkAyz7apCQ
// SIG // MG6H81kwnfp+1pez6CGXfvjSE/MIt1NtUrRFkJ9IAEpH
// SIG // ZhEnKWaol+TTBoFKovmEpxFHFAmCn4TtVXj+AZodUAiF
// SIG // ABAwRu233iNGu8QtVJ+vHnhBMXfMm987g5OhYQK1HQ2x
// SIG // /PebsgHOIktU//kFw8IgCwIDAQABo4IBqzCCAacwDwYD
// SIG // VR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUIzT42VJGcArt
// SIG // QPt2+7MrsMM1sw8wCwYDVR0PBAQDAgGGMBAGCSsGAQQB
// SIG // gjcVAQQDAgEAMIGYBgNVHSMEgZAwgY2AFA6sgmBAVieX
// SIG // 5SUT/CrhClOVWeSkoWOkYTBfMRMwEQYKCZImiZPyLGQB
// SIG // GRYDY29tMRkwFwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0
// SIG // MS0wKwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZp
// SIG // Y2F0ZSBBdXRob3JpdHmCEHmtFqFKoKWtTHNY9AcTLmUw
// SIG // UAYDVR0fBEkwRzBFoEOgQYY/aHR0cDovL2NybC5taWNy
// SIG // b3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvbWljcm9z
// SIG // b2Z0cm9vdGNlcnQuY3JsMFQGCCsGAQUFBwEBBEgwRjBE
// SIG // BggrBgEFBQcwAoY4aHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jZXJ0cy9NaWNyb3NvZnRSb290Q2VydC5j
// SIG // cnQwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcN
// SIG // AQEFBQADggIBABCXisNcA0Q23em0rXfbznlRTQGxLnRx
// SIG // W20ME6vOvnuPuC7UEqKMbWK4VwLLTiATUJndekDiV7uv
// SIG // WJoc4R0Bhqy7ePKL0Ow7Ae7ivo8KBciNSOLwUxXdT6uS
// SIG // 5OeNatWAweaU8gYvhQPpkSokInD79vzkeJkuDfcH4nC8
// SIG // GE6djmsKcpW4oTmcZy3FUQ7qYlw/FpiLID/iBxoy+cwx
// SIG // SnYxPStyC8jqcD3/hQoT38IKYY7w17gX606Lf8U1K16j
// SIG // v+u8fQtCe9RTciHuMMq7eGVcWwEXChQO0toUmPU8uWZY
// SIG // sy0v5/mFhsxRVuidcJRsrDlM1PZ5v6oYemIp76KbKTQG
// SIG // dxpiyT0ebR+C8AvHLLvPQ7Pl+ex9teOkqHQ1uE7FcSMS
// SIG // JnYLPFKMcVpGQxS8s7OwTWfIn0L/gHkhgJ4VMGboQhJe
// SIG // GsieIiHQQ+kr6bv0SMws1NgygEwmKkgkX1rqVu+m3pmd
// SIG // yjpvvYEndAYR7nYhv5uCwSdUtrFqPYmhdmG0bqETpr+q
// SIG // R/ASb/2KMmyy/t9RyIwjyWa9nR2HEmQCPS2vWY+45CHl
// SIG // tbDKY7R4VAXUQS5QrJSwpXirs6CWdRrZkocTdSIvMqgI
// SIG // bqBbjCW/oO+EyiHW6x5PyZruSeD3AWVviQt9yGnI5m7q
// SIG // p5fOMSn/DsVbXNhNG6HY+i+ePy5VFmvJE6P9MYIEpTCC
// SIG // BKECAQEwgZAweTELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEG
// SIG // A1UEAxMaTWljcm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EC
// SIG // EzMAAACdHo0nrrjz2DgAAQAAAJ0wCQYFKw4DAhoFAKCB
// SIG // vjAZBgkqhkiG9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgor
// SIG // BgEEAYI3AgELMQ4wDAYKKwYBBAGCNwIBFTAjBgkqhkiG
// SIG // 9w0BCQQxFgQUd8xYKFyxVEDYjsn2/bGJLk+B5iwwXgYK
// SIG // KwYBBAGCNwIBDDFQME6gJoAkAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0ACAATABlAGEAcgBuAGkAbgBnoSSAImh0dHA6Ly93
// SIG // d3cubWljcm9zb2Z0LmNvbS9sZWFybmluZyAwDQYJKoZI
// SIG // hvcNAQEBBQAEggEAJwcCThV+OVFpc0nCKAJGS05/l1d3
// SIG // OPpIdvXv7IvFChu4R4og7ckRqmVuhGDsUEQqKrM5/vGp
// SIG // au6p5VbB9qkF4tI89mfzuI3yVZqeFoPodZhbLmmdA1IV
// SIG // fTeQ6v76iaZWkKEJZfZkfYeULPXsUB/VjnfpUPGC7Gxq
// SIG // 7hqaTe0z9l3aKqKlFG7iEgZkj4UpIIuChFdI6t50XYNQ
// SIG // x/WHEzuXSC5Kv+Qcq2nKpQVykjyxtOxMYC46cWPDI2jm
// SIG // PJddiqvZQlPfUt7JXTquPfA4vZnajwIA/e/Vsn8VQ4Kl
// SIG // bf6FfTkB/qMbSFCGMiCjrowizlaeT54N4KVt83PfOpho
// SIG // Jd4KA6GCAigwggIkBgkqhkiG9w0BCQYxggIVMIICEQIB
// SIG // ATCBjjB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQD
// SIG // ExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0ECEzMAAAAr
// SIG // OTJIwbLJSPMAAAAAACswCQYFKw4DAhoFAKBdMBgGCSqG
// SIG // SIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkF
// SIG // MQ8XDTEyMTExNTAwMDgwM1owIwYJKoZIhvcNAQkEMRYE
// SIG // FBSoxwKL+uRem42yZ1ltpyZNnhxlMA0GCSqGSIb3DQEB
// SIG // BQUABIIBADo/54ycGILqZ6GLjCS0QF0ol8HLD8+CEN+A
// SIG // jfoLWLxtwjiHcIiIsHieSSmbq4PI75M083XGjIZv3FKb
// SIG // lKzci1H3Iq/sGgNz0+bYn+ydHZkh9v89dlQ5hH1XmI4Z
// SIG // jX3jTrVVWdbuisKoqYpcxLEyT6IVSYwp6wlPhKso191r
// SIG // 2srEfW2EG/2H0GoZ78a7uAzwXvAeDLIA6z9F9jW56XpF
// SIG // X5G7GTKCxTrbzujnLMVmWAAKz66Vtry9wgnLFGSCR2Sg
// SIG // KxTxJLQenSGJKh8QvLl7ahO4ySu2rWdmNdillFseVvJs
// SIG // CPyVWAXKcieY94Y1uHX0/GSHOZVLMolZchlBIdeXiL8=
// SIG // End signature block
