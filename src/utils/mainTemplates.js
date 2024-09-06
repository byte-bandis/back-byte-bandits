const welcomeTemplate = (userName) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenida</title>
</head>
<body>
    <h1>Hola, ${userName}!</h1>
    <p>Gracias por registrarte en nuestra plataforma.</p>
</body>
</html>
`;
const resetPasswordTemplate = (userName, resetLink) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
    dir="ltr"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    lang="und"
    style="
        width: 100%;
        font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        padding: 0;
        margin: 0;
    "
>
    <head>
        <meta
            http-equiv="Content-Security-Policy"
            content="script-src 'none'; connect-src 'none'; object-src 'none'; form-action https://cdn.ampproject.org https://amp.stripo.email;"
        />
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta content="telephone=no" name="format-detection" />
        <title>Reset Password</title>
       
        <link
            rel="shortcut icon"
            type="image/png"
            href="https://stripo.email/assets/img/favicon.png"
        />
        <style type="text/css">
            #outlook a {
                padding: 0;
            }
            .ExternalClass {
                width: 100%;
            }
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }
            .es-button {
                mso-style-priority: 100 !important;
                text-decoration: none !important;
            }
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
            .es-desk-hidden {
                display: none;
                float: left;
                overflow: hidden;
                width: 0;
                max-height: 0;
                line-height: 0;
                mso-hide: all;
            }
            .es-button-border:hover a.es-button {
                background: #ffffff !important;
                border-color: #ffffff !important;
            }
            .es-button-border:hover {
                background: #ffffff !important;
                border-style: solid solid solid solid !important;
                border-color: #3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3 !important;
            }
            @media only screen and (max-width: 600px) {
                p,
                ul li,
                ol li,
                a {
                    font-size: 16px !important;
                    line-height: 150% !important;
                }
                h1 {
                    font-size: 20px !important;
                    text-align: center;
                    line-height: 120% !important;
                }
                h2 {
                    font-size: 16px !important;
                    text-align: left;
                    line-height: 120% !important;
                }
                h3 {
                    font-size: 20px !important;
                    text-align: center;
                    line-height: 120% !important;
                }
                h1 a {
                    font-size: 20px !important;
                }
                h2 a {
                    font-size: 16px !important;
                    text-align: left;
                }
                h3 a {
                    font-size: 20px !important;
                }
                .es-menu td a {
                    font-size: 14px !important;
                }
                .es-header-body p,
                .es-header-body ul li,
                .es-header-body ol li,
                .es-header-body a {
                    font-size: 10px !important;
                }
                .es-footer-body p,
                .es-footer-body ul li,
                .es-footer-body ol li,
                .es-footer-body a {
                    font-size: 12px !important;
                }
                .es-infoblock p,
                .es-infoblock ul li,
                .es-infoblock ol li,
                .es-infoblock a {
                    font-size: 12px !important;
                }
                *[class='gmail-fix'] {
                    display: none !important;
                }
                .es-m-txt-c,
                .es-m-txt-c h1,
                .es-m-txt-c h2,
                .es-m-txt-c h3 {
                    text-align: center !important;
                }
                .es-m-txt-r,
                .es-m-txt-r h1,
                .es-m-txt-r h2,
                .es-m-txt-r h3 {
                    text-align: right !important;
                }
                .es-m-txt-l,
                .es-m-txt-l h1,
                .es-m-txt-l h2,
                .es-m-txt-l h3 {
                    text-align: left !important;
                }
                .es-m-txt-r img,
                .es-m-txt-c img,
                .es-m-txt-l img {
                    display: inline !important;
                }
                .es-button-border {
                    display: block !important;
                }
                a.es-button {
                    font-size: 14px !important;
                    display: block !important;
                    border-left-width: 0px !important;
                    border-right-width: 0px !important;
                }
                .es-btn-fw {
                    border-width: 10px 0px !important;
                    text-align: center !important;
                }
                .es-adaptive table,
                .es-btn-fw,
                .es-btn-fw-brdr,
                .es-left,
                .es-right {
                    width: 100% !important;
                }
                .es-content table,
                .es-header table,
                .es-footer table,
                .es-content,
                .es-footer,
                .es-header {
                    width: 100% !important;
                    max-width: 600px !important;
                }
                .es-adapt-td {
                    display: block !important;
                    width: 100% !important;
                }
                .adapt-img {
                    width: 100% !important;
                    height: auto !important;
                }
                .es-m-p0 {
                    padding: 0px !important;
                }
                .es-m-p0r {
                    padding-right: 0px !important;
                }
                .es-m-p0l {
                    padding-left: 0px !important;
                }
                .es-m-p0t {
                    padding-top: 0px !important;
                }
                .es-m-p0b {
                    padding-bottom: 0 !important;
                }
                .es-m-p20b {
                    padding-bottom: 20px !important;
                }
                .es-mobile-hidden,
                .es-hidden {
                    display: none !important;
                }
                tr.es-desk-hidden,
                td.es-desk-hidden,
                table.es-desk-hidden {
                    width: auto !important;
                    overflow: visible !important;
                    float: none !important;
                    max-height: inherit !important;
                    line-height: inherit !important;
                }
                tr.es-desk-hidden {
                    display: table-row !important;
                }
                table.es-desk-hidden {
                    display: table !important;
                }
                td.es-desk-menu-hidden {
                    display: table-cell !important;
                }
                .es-menu td {
                    width: 1% !important;
                }
                table.es-table-not-adapt,
                .esd-block-html table {
                    width: auto !important;
                }
                table.es-social {
                    display: inline-block !important;
                }
                table.es-social td {
                    display: inline-block !important;
                }
            }
            @media screen and (max-width: 384px) {
                .mail-message-content {
                    width: 414px !important;
                }
            }
        </style>
    </head>
    <body
        style="
            width: 100%;
            font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            padding: 0;
            margin: 0;
        "
    >
        <div
            dir="ltr"
            class="es-wrapper-color"
            lang="und"
            style="background-color: #fafafa"
        >
           
            <table
                class="es-wrapper"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                role="none"
                style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    padding: 0;
                    margin: 0;
                    width: 100%;
                    height: 100%;
                    background-repeat: repeat;
                    background-position: center top;
                "
            >
                <tbody>
                    <tr style="border-collapse: collapse">
                        <td valign="top" style="padding: 0; margin: 0">
                            <table
                                cellpadding="0"
                                cellspacing="0"
                                class="es-content"
                                align="center"
                                role="none"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    table-layout: fixed !important;
                                    width: 100%;
                                "
                            >
                                <tbody>
                                    <tr style="border-collapse: collapse">
                                        <td
                                            class="es-adaptive"
                                            align="center"
                                            style="padding: 0; margin: 0"
                                        >
                                            <table
                                                class="es-content-body"
                                                style="
                                                    mso-table-lspace: 0pt;
                                                    mso-table-rspace: 0pt;
                                                    border-collapse: collapse;
                                                    border-spacing: 0px;
                                                    background-color: transparent;
                                                    width: 600px;
                                                "
                                                cellspacing="0"
                                                cellpadding="0"
                                                bgcolor="#ffffff"
                                                align="center"
                                                role="none"
                                            >
                                                <tbody>
                                                    <tr
                                                        style="
                                                            border-collapse: collapse;
                                                        "
                                                    >
                                                        <td
                                                            align="left"
                                                            style="
                                                                padding: 10px;
                                                                margin: 0;
                                                            "
                                                        >
                                                            <table
                                                                width="100%"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            valign="top"
                                                                            align="center"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 580px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                "
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="center"
                                                                                            class="es-infoblock"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                line-height: 14.4px;
                                                                                                font-size: 12px;
                                                                                                color: #cccccc;
                                                                                            "
                                                                                        >
                                                                                            <p
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-size: 12px;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    line-height: 14.4px;
                                                                                                    color: #cccccc;
                                                                                                "
                                                                                            >
                                                                                                Put
                                                                                                your
                                                                                                preheader
                                                                                                text
                                                                                                here.
                                                                                                <a
                                                                                                    href="https://viewstripo.email"
                                                                                                    class="view"
                                                                                                    target="_blank"
                                                                                                    style="
                                                                                                        -webkit-text-size-adjust: none;
                                                                                                        -ms-text-size-adjust: none;
                                                                                                        mso-line-height-rule: exactly;
                                                                                                        font-family: helvetica,
                                                                                                            'helvetica neue',
                                                                                                            arial,
                                                                                                            verdana,
                                                                                                            sans-serif;
                                                                                                        font-size: 12px;
                                                                                                        text-decoration: none;
                                                                                                        color: #cccccc;
                                                                                                    "
                                                                                                    >View
                                                                                                    in
                                                                                                    browser</a
                                                                                                >
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                cellpadding="0"
                                cellspacing="0"
                                class="es-header"
                                align="center"
                                role="none"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    table-layout: fixed !important;
                                    width: 100%;
                                    background-color: transparent;
                                    background-repeat: repeat;
                                    background-position: center top;
                                "
                            >
                                <tbody>
                                    <tr style="border-collapse: collapse">
                                        <td
                                            class="es-adaptive"
                                            align="center"
                                            style="padding: 0; margin: 0"
                                        >
                                            <table
                                                class="es-header-body"
                                                style="
                                                    mso-table-lspace: 0pt;
                                                    mso-table-rspace: 0pt;
                                                    border-collapse: collapse;
                                                    border-spacing: 0px;
                                                    background-color: #3d5ca3;
                                                    width: 600px;
                                                "
                                                cellspacing="0"
                                                cellpadding="0"
                                                bgcolor="#3d5ca3"
                                                align="center"
                                                role="none"
                                            >
                                                <tbody>
                                                    <tr
                                                        style="
                                                            border-collapse: collapse;
                                                        "
                                                    >
                                                        <td
                                                            style="
                                                                margin: 0;
                                                                padding-top: 20px;
                                                                padding-bottom: 20px;
                                                                padding-left: 20px;
                                                                padding-right: 20px;
                                                                background-color: #3d5ca3;
                                                            "
                                                            bgcolor="#3d5ca3"
                                                            align="left"
                                                        >
                                                           
                                                        
                                                            <table
                                                                class="es-left"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                align="left"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                    float: left;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            class="es-m-p20b"
                                                                            align="left"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 270px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                "
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            class="es-m-p0l es-m-txt-c"
                                                                                            align="left"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                font-size: 0;
                                                                                            "
                                                                                        >
                                                                                            <a
                                                                                                href="https://viewstripo.email"
                                                                                                target="_blank"
                                                                                                style="
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    font-size: 14px;
                                                                                                    text-decoration: none;
                                                                                                    color: #1376c8;
                                                                                                "
                                                                                                ><img
                                                                                                    src="/src/assets/images/ICraftYou.png"
                                                                                                    alt
                                                                                                    style="
                                                                                                        display: block;
                                                                                                        border: 0;
                                                                                                        outline: none;
                                                                                                        text-decoration: none;
                                                                                                        -ms-interpolation-mode: bicubic;
                                                                                                    "
                                                                                                    width="183"
                                                                                            /></a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            
                                                            <table
                                                                class="es-right"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                align="right"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                    float: right;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            align="left"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 270px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                "
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            class="es-m-txt-c"
                                                                                            align="right"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-top: 10px;
                                                                                            "
                                                                                        >
                                                                                            
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                           
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                class="es-content"
                                cellspacing="0"
                                cellpadding="0"
                                align="center"
                                role="none"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    table-layout: fixed !important;
                                    width: 100%;
                                "
                            >
                                <tbody>
                                    <tr style="border-collapse: collapse">
                                        <td
                                            style="
                                                padding: 0;
                                                margin: 0;
                                                background-color: #fafafa;
                                            "
                                            bgcolor="#fafafa"
                                            align="center"
                                        >
                                            <table
                                                class="es-content-body"
                                                style="
                                                    mso-table-lspace: 0pt;
                                                    mso-table-rspace: 0pt;
                                                    border-collapse: collapse;
                                                    border-spacing: 0px;
                                                    background-color: #ffffff;
                                                    width: 600px;
                                                "
                                                cellspacing="0"
                                                cellpadding="0"
                                                bgcolor="#ffffff"
                                                align="center"
                                                role="none"
                                            >
                                                <tbody>
                                                    <tr
                                                        style="
                                                            border-collapse: collapse;
                                                        "
                                                    >
                                                        <td
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                padding-left: 20px;
                                                                padding-right: 20px;
                                                                padding-top: 40px;
                                                                background-color: transparent;
                                                                background-position: left
                                                                    top;
                                                            "
                                                            bgcolor="transparent"
                                                            align="left"
                                                        >
                                                            <table
                                                                width="100%"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            valign="top"
                                                                            align="center"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 560px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                    background-position: left
                                                                                        top;
                                                                                "
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="center"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-top: 5px;
                                                                                                padding-bottom: 5px;
                                                                                                font-size: 0;
                                                                                            "
                                                                                        >
                                                                                            <img
                                                                                                src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png"
                                                                                                alt
                                                                                                style="
                                                                                                    display: block;
                                                                                                    border: 0;
                                                                                                    outline: none;
                                                                                                    text-decoration: none;
                                                                                                    -ms-interpolation-mode: bicubic;
                                                                                                "
                                                                                                width="175"
                                                                                            />
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="center"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-top: 15px;
                                                                                                padding-bottom: 15px;
                                                                                            "
                                                                                        >
                                                                                            <h1
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    line-height: 24px;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-family: arial,
                                                                                                        'helvetica neue',
                                                                                                        helvetica,
                                                                                                        sans-serif;
                                                                                                    font-size: 20px;
                                                                                                    font-style: normal;
                                                                                                    font-weight: normal;
                                                                                                    color: #333333;
                                                                                                "
                                                                                            >
                                                                                                <strong
                                                                                                    >¿HAS OLVIDADO
                                                                                                </strong>
                                                                                            </h1>
                                                                                            <h1
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    line-height: 24px;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-family: arial,
                                                                                                        'helvetica neue',
                                                                                                        helvetica,
                                                                                                        sans-serif;
                                                                                                    font-size: 20px;
                                                                                                    font-style: normal;
                                                                                                    font-weight: normal;
                                                                                                    color: #333333;
                                                                                                "
                                                                                            >
                                                                                                <strong
                                                                                                    >&nbsp;TU CONTRASEÑA?</strong
                                                                                                >
                                                                                            </h1>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="left"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-left: 40px;
                                                                                                padding-right: 40px;
                                                                                            "
                                                                                        >
                                                                                            <p
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-size: 16px;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    line-height: 24px;
                                                                                                    color: #666666;
                                                                                                    text-align: center;
                                                                                                "
                                                                                            >
                                                                                                HOLA,&nbsp;
                                                                                                ${userName.toUpperCase()}
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="left"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-right: 35px;
                                                                                                padding-left: 40px;
                                                                                            "
                                                                                        >
                                                                                            <p
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-size: 16px;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    line-height: 24px;
                                                                                                    color: #666666;
                                                                                                    text-align: center;
                                                                                                "
                                                                                            >
                                                                                                There
                                                                                                was
                                                                                                a
                                                                                                request
                                                                                                to
                                                                                                change
                                                                                                your
                                                                                                password!
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="center"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-top: 25px;
                                                                                                padding-left: 40px;
                                                                                                padding-right: 40px;
                                                                                            "
                                                                                        >
                                                                                            <p
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-size: 16px;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    line-height: 24px;
                                                                                                    color: #666666;
                                                                                                "
                                                                                            >
                                                                                                If
                                                                                                did
                                                                                                not
                                                                                                make
                                                                                                this
                                                                                                request,
                                                                                                just
                                                                                                ignore
                                                                                                this
                                                                                                email.
                                                                                                Otherwise,
                                                                                                please
                                                                                                click
                                                                                                the
                                                                                                button
                                                                                                below
                                                                                                to
                                                                                                change
                                                                                                your
                                                                                                password:
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="center"
                                                                                            style="
                                                                                                margin: 0;
                                                                                                padding-left: 10px;
                                                                                                padding-right: 10px;
                                                                                                padding-top: 40px;
                                                                                                padding-bottom: 40px;
                                                                                            "
                                                                                        >
                                                                                            <span
                                                                                                class="es-button-border"
                                                                                                style="
                                                                                                    border-style: solid;
                                                                                                    border-color: #3d5ca3;
                                                                                                    background: #ffffff;
                                                                                                    border-width: 2px;
                                                                                                    display: inline-block;
                                                                                                    border-radius: 10px;
                                                                                                    width: auto;
                                                                                                "
                                                                                                ><a
                                                                                                    href="${resetLink}"
                                                                                                    class="es-button"
                                                                                                    target="_blank"
                                                                                                    style="
                                                                                                        mso-style-priority: 100 !important;
                                                                                                        text-decoration: none;
                                                                                                        -webkit-text-size-adjust: none;
                                                                                                        -ms-text-size-adjust: none;
                                                                                                        mso-line-height-rule: exactly;
                                                                                                        font-family: arial,
                                                                                                            'helvetica neue',
                                                                                                            helvetica,
                                                                                                            sans-serif;
                                                                                                        font-size: 14px;
                                                                                                        color: #3d5ca3;
                                                                                                        border-style: solid;
                                                                                                        border-color: #ffffff;
                                                                                                        border-width: 15px
                                                                                                            20px
                                                                                                            15px
                                                                                                            20px;
                                                                                                        display: inline-block;
                                                                                                        background: #ffffff;
                                                                                                        border-radius: 10px;
                                                                                                        font-weight: bold;
                                                                                                        font-style: normal;
                                                                                                        line-height: 16.8px;
                                                                                                        width: auto;
                                                                                                        text-align: center;
                                                                                                    "
                                                                                                    >RESET
                                                                                                    PASSWORD</a
                                                                                                ></span
                                                                                            >
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style="
                                                            border-collapse: collapse;
                                                        "
                                                    >
                                                        <td
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                padding-left: 10px;
                                                                padding-right: 10px;
                                                                padding-top: 20px;
                                                                background-position: center
                                                                    center;
                                                            "
                                                            align="left"
                                                        >
                                                            <!--[if mso]><table style="width:580px" cellpadding="0" cellspacing="0"><tr><td style="width:199px" valign="top"><![endif]-->
                                                            <table
                                                                class="es-left"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                align="left"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                    float: left;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            align="left"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 199px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                    background-position: center
                                                                                        center;
                                                                                "
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            class="es-m-txt-c"
                                                                                            align="right"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-top: 15px;
                                                                                            "
                                                                                        >
                                                                                            <p
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-size: 16px;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    line-height: 24px;
                                                                                                    color: #666666;
                                                                                                "
                                                                                            >
                                                                                                <strong
                                                                                                    >Follow
                                                                                                    us:</strong
                                                                                                >
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td><td style="width:20px"></td><td style="width:361px" valign="top"><![endif]-->
                                                            <table
                                                                class="es-right"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                align="right"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                    float: right;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            align="left"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 361px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                    background-position: center
                                                                                        center;
                                                                                "
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            class="es-m-txt-c"
                                                                                            align="left"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-bottom: 5px;
                                                                                                padding-top: 10px;
                                                                                                font-size: 0;
                                                                                            "
                                                                                        >
                                                                                            <table
                                                                                                class="es-table-not-adapt es-social"
                                                                                                cellspacing="0"
                                                                                                cellpadding="0"
                                                                                                role="presentation"
                                                                                                style="
                                                                                                    mso-table-lspace: 0pt;
                                                                                                    mso-table-rspace: 0pt;
                                                                                                    border-collapse: collapse;
                                                                                                    border-spacing: 0px;
                                                                                                "
                                                                                            >
                                                                                                <tbody>
                                                                                                    <tr
                                                                                                        style="
                                                                                                            border-collapse: collapse;
                                                                                                        "
                                                                                                    >
                                                                                                        <td
                                                                                                            valign="top"
                                                                                                            align="center"
                                                                                                            style="
                                                                                                                padding: 0;
                                                                                                                margin: 0;
                                                                                                                padding-right: 10px;
                                                                                                            "
                                                                                                        >
                                                                                                            <img
                                                                                                                src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/facebook-rounded-gray.png"
                                                                                                                alt="Fb"
                                                                                                                title="Facebook"
                                                                                                                width="32"
                                                                                                                style="
                                                                                                                    display: block;
                                                                                                                    border: 0;
                                                                                                                    outline: none;
                                                                                                                    text-decoration: none;
                                                                                                                    -ms-interpolation-mode: bicubic;
                                                                                                                "
                                                                                                            />
                                                                                                        </td>
                                                                                                        <td
                                                                                                            valign="top"
                                                                                                            align="center"
                                                                                                            style="
                                                                                                                padding: 0;
                                                                                                                margin: 0;
                                                                                                                padding-right: 10px;
                                                                                                            "
                                                                                                        >
                                                                                                            <img
                                                                                                                src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/twitter-rounded-gray.png"
                                                                                                                alt="Tw"
                                                                                                                title="Twitter"
                                                                                                                width="32"
                                                                                                                style="
                                                                                                                    display: block;
                                                                                                                    border: 0;
                                                                                                                    outline: none;
                                                                                                                    text-decoration: none;
                                                                                                                    -ms-interpolation-mode: bicubic;
                                                                                                                "
                                                                                                            />
                                                                                                        </td>
                                                                                                        <td
                                                                                                            valign="top"
                                                                                                            align="center"
                                                                                                            style="
                                                                                                                padding: 0;
                                                                                                                margin: 0;
                                                                                                                padding-right: 10px;
                                                                                                            "
                                                                                                        >
                                                                                                            <img
                                                                                                                src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/instagram-rounded-gray.png"
                                                                                                                alt="Ig"
                                                                                                                title="Instagram"
                                                                                                                width="32"
                                                                                                                style="
                                                                                                                    display: block;
                                                                                                                    border: 0;
                                                                                                                    outline: none;
                                                                                                                    text-decoration: none;
                                                                                                                    -ms-interpolation-mode: bicubic;
                                                                                                                "
                                                                                                            />
                                                                                                        </td>
                                                                                                        <td
                                                                                                            valign="top"
                                                                                                            align="center"
                                                                                                            style="
                                                                                                                padding: 0;
                                                                                                                margin: 0;
                                                                                                                padding-right: 10px;
                                                                                                            "
                                                                                                        >
                                                                                                            <img
                                                                                                                src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/youtube-rounded-gray.png"
                                                                                                                alt="Yt"
                                                                                                                title="Youtube"
                                                                                                                width="32"
                                                                                                                style="
                                                                                                                    display: block;
                                                                                                                    border: 0;
                                                                                                                    outline: none;
                                                                                                                    text-decoration: none;
                                                                                                                    -ms-interpolation-mode: bicubic;
                                                                                                                "
                                                                                                            />
                                                                                                        </td>
                                                                                                        <td
                                                                                                            valign="top"
                                                                                                            align="center"
                                                                                                            style="
                                                                                                                padding: 0;
                                                                                                                margin: 0;
                                                                                                                padding-right: 10px;
                                                                                                            "
                                                                                                        >
                                                                                                            <img
                                                                                                                src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/linkedin-rounded-gray.png"
                                                                                                                alt="In"
                                                                                                                title="Linkedin"
                                                                                                                width="32"
                                                                                                                style="
                                                                                                                    display: block;
                                                                                                                    border: 0;
                                                                                                                    outline: none;
                                                                                                                    text-decoration: none;
                                                                                                                    -ms-interpolation-mode: bicubic;
                                                                                                                "
                                                                                                            />
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style="
                                                            border-collapse: collapse;
                                                        "
                                                    >
                                                        <td
                                                            style="
                                                                margin: 0;
                                                                padding-top: 5px;
                                                                padding-bottom: 20px;
                                                                padding-left: 20px;
                                                                padding-right: 20px;
                                                                background-position: left
                                                                    top;
                                                            "
                                                            align="left"
                                                        >
                                                            <table
                                                                width="100%"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            valign="top"
                                                                            align="center"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 560px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                "
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="center"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                            "
                                                                                        >
                                                                                            <p
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-size: 14px;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    line-height: 21px;
                                                                                                    color: #666666;
                                                                                                "
                                                                                            >
                                                                                                Contact
                                                                                                us:
                                                                                                <a
                                                                                                    target="_blank"
                                                                                                    style="
                                                                                                        -webkit-text-size-adjust: none;
                                                                                                        -ms-text-size-adjust: none;
                                                                                                        mso-line-height-rule: exactly;
                                                                                                        font-family: helvetica,
                                                                                                            'helvetica neue',
                                                                                                            arial,
                                                                                                            verdana,
                                                                                                            sans-serif;
                                                                                                        font-size: 14px;
                                                                                                        text-decoration: none;
                                                                                                        color: #666666;
                                                                                                    "
                                                                                                    href="tel:123456789"
                                                                                                    >123456789</a
                                                                                                >
                                                                                                |
                                                                                                <a
                                                                                                    target="_blank"
                                                                                                    href="mailto:your@mail.com"
                                                                                                    style="
                                                                                                        -webkit-text-size-adjust: none;
                                                                                                        -ms-text-size-adjust: none;
                                                                                                        mso-line-height-rule: exactly;
                                                                                                        font-family: helvetica,
                                                                                                            'helvetica neue',
                                                                                                            arial,
                                                                                                            verdana,
                                                                                                            sans-serif;
                                                                                                        font-size: 14px;
                                                                                                        text-decoration: none;
                                                                                                        color: #666666;
                                                                                                    "
                                                                                                    >your@mail.com</a
                                                                                                >
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                class="es-footer"
                                cellspacing="0"
                                cellpadding="0"
                                align="center"
                                role="none"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    table-layout: fixed !important;
                                    width: 100%;
                                    background-color: transparent;
                                    background-repeat: repeat;
                                    background-position: center top;
                                "
                            >
                                <tbody>
                                    <tr style="border-collapse: collapse">
                                        <td
                                            style="
                                                padding: 0;
                                                margin: 0;
                                                background-color: #fafafa;
                                            "
                                            bgcolor="#fafafa"
                                            align="center"
                                        >
                                            <table
                                                class="es-footer-body"
                                                cellspacing="0"
                                                cellpadding="0"
                                                bgcolor="#ffffff"
                                                align="center"
                                                role="none"
                                                style="
                                                    mso-table-lspace: 0pt;
                                                    mso-table-rspace: 0pt;
                                                    border-collapse: collapse;
                                                    border-spacing: 0px;
                                                    background-color: transparent;
                                                    width: 600px;
                                                "
                                            >
                                                <tbody>
                                                    <tr
                                                        style="
                                                            border-collapse: collapse;
                                                        "
                                                    >
                                                        <td
                                                            style="
                                                                margin: 0;
                                                                padding-top: 10px;
                                                                padding-left: 20px;
                                                                padding-right: 20px;
                                                                padding-bottom: 30px;
                                                                background-color: #0b5394;
                                                                background-position: left
                                                                    top;
                                                            "
                                                            bgcolor="#0b5394"
                                                            align="left"
                                                        >
                                                            <table
                                                                width="100%"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            valign="top"
                                                                            align="center"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 560px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                "
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="left"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-top: 5px;
                                                                                                padding-bottom: 5px;
                                                                                            "
                                                                                        >
                                                                                            <h2
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    line-height: 19.2px;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-family: arial,
                                                                                                        'helvetica neue',
                                                                                                        helvetica,
                                                                                                        sans-serif;
                                                                                                    font-size: 16px;
                                                                                                    font-style: normal;
                                                                                                    font-weight: normal;
                                                                                                    color: #ffffff;
                                                                                                "
                                                                                            >
                                                                                                <strong
                                                                                                    >Have
                                                                                                    quastions?</strong
                                                                                                >
                                                                                            </h2>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="left"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-bottom: 5px;
                                                                                            "
                                                                                        >
                                                                                            <p
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-size: 14px;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    line-height: 21px;
                                                                                                    color: #ffffff;
                                                                                                "
                                                                                            >
                                                                                                We
                                                                                                are
                                                                                                here
                                                                                                to
                                                                                                help,
                                                                                                learn
                                                                                                more
                                                                                                about
                                                                                                us
                                                                                                <a
                                                                                                    target="_blank"
                                                                                                    style="
                                                                                                        -webkit-text-size-adjust: none;
                                                                                                        -ms-text-size-adjust: none;
                                                                                                        mso-line-height-rule: exactly;
                                                                                                        font-family: helvetica,
                                                                                                            'helvetica neue',
                                                                                                            arial,
                                                                                                            verdana,
                                                                                                            sans-serif;
                                                                                                        font-size: 14px;
                                                                                                        text-decoration: none;
                                                                                                        color: #ffffff;
                                                                                                    "
                                                                                                    href=""
                                                                                                    >here</a
                                                                                                >
                                                                                            </p>
                                                                                            <p
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-size: 14px;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    line-height: 21px;
                                                                                                    color: #ffffff;
                                                                                                "
                                                                                            >
                                                                                                or
                                                                                                <a
                                                                                                    target="_blank"
                                                                                                    style="
                                                                                                        -webkit-text-size-adjust: none;
                                                                                                        -ms-text-size-adjust: none;
                                                                                                        mso-line-height-rule: exactly;
                                                                                                        font-family: helvetica,
                                                                                                            'helvetica neue',
                                                                                                            arial,
                                                                                                            verdana,
                                                                                                            sans-serif;
                                                                                                        font-size: 14px;
                                                                                                        text-decoration: none;
                                                                                                        color: #ffffff;
                                                                                                    "
                                                                                                    href=""
                                                                                                    >contact
                                                                                                    us</a
                                                                                                ><br />
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                class="es-content"
                                cellspacing="0"
                                cellpadding="0"
                                align="center"
                                role="none"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    table-layout: fixed !important;
                                    width: 100%;
                                "
                            >
                                <tbody>
                                    <tr style="border-collapse: collapse">
                                        <td
                                            style="
                                                padding: 0;
                                                margin: 0;
                                                background-color: #fafafa;
                                            "
                                            bgcolor="#fafafa"
                                            align="center"
                                        >
                                            <table
                                                class="es-content-body"
                                                style="
                                                    mso-table-lspace: 0pt;
                                                    mso-table-rspace: 0pt;
                                                    border-collapse: collapse;
                                                    border-spacing: 0px;
                                                    background-color: transparent;
                                                    width: 600px;
                                                "
                                                cellspacing="0"
                                                cellpadding="0"
                                                bgcolor="transparent"
                                                align="center"
                                                role="none"
                                            >
                                                <tbody>
                                                    <tr
                                                        style="
                                                            border-collapse: collapse;
                                                        "
                                                    >
                                                        <td
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                padding-top: 15px;
                                                                background-position: left
                                                                    top;
                                                            "
                                                            align="left"
                                                        >
                                                            <table
                                                                width="100%"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            valign="top"
                                                                            align="center"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 600px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                "
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                            "
                                                                                        >
                                                                                            <table
                                                                                                class="es-menu"
                                                                                                width="100%"
                                                                                                cellspacing="0"
                                                                                                cellpadding="0"
                                                                                                role="presentation"
                                                                                                style="
                                                                                                    mso-table-lspace: 0pt;
                                                                                                    mso-table-rspace: 0pt;
                                                                                                    border-collapse: collapse;
                                                                                                    border-spacing: 0px;
                                                                                                "
                                                                                            >
                                                                                                <tbody>
                                                                                                    <tr
                                                                                                        class="links"
                                                                                                        style="
                                                                                                            border-collapse: collapse;
                                                                                                        "
                                                                                                    >
                                                                                                        <td
                                                                                                            style="
                                                                                                                margin: 0;
                                                                                                                padding-left: 5px;
                                                                                                                padding-right: 5px;
                                                                                                                padding-top: 0px;
                                                                                                                padding-bottom: 1px;
                                                                                                                border: 0;
                                                                                                            "
                                                                                                            id="esd-menu-id-0"
                                                                                                            width="33.33%"
                                                                                                            valign="top"
                                                                                                            bgcolor="transparent"
                                                                                                            align="center"
                                                                                                        >
                                                                                                            <a
                                                                                                                target="_blank"
                                                                                                                href="https://viewstripo.email"
                                                                                                                style="
                                                                                                                    -webkit-text-size-adjust: none;
                                                                                                                    -ms-text-size-adjust: none;
                                                                                                                    mso-line-height-rule: exactly;
                                                                                                                    font-family: helvetica,
                                                                                                                        'helvetica neue',
                                                                                                                        arial,
                                                                                                                        verdana,
                                                                                                                        sans-serif;
                                                                                                                    font-size: 14px;
                                                                                                                    text-decoration: none;
                                                                                                                    display: block;
                                                                                                                    color: #3d5ca3;
                                                                                                                "
                                                                                                                >Sing
                                                                                                                up</a
                                                                                                            >
                                                                                                        </td>
                                                                                                        <td
                                                                                                            style="
                                                                                                                margin: 0;
                                                                                                                padding-left: 5px;
                                                                                                                padding-right: 5px;
                                                                                                                padding-top: 0px;
                                                                                                                padding-bottom: 1px;
                                                                                                                border: 0;
                                                                                                                border-left: 1px
                                                                                                                    solid
                                                                                                                    #3d5ca3;
                                                                                                            "
                                                                                                            id="esd-menu-id-1"
                                                                                                            esdev-border-color="#3d5ca3"
                                                                                                            width="33.33%"
                                                                                                            valign="top"
                                                                                                            bgcolor="transparent"
                                                                                                            align="center"
                                                                                                        >
                                                                                                            <a
                                                                                                                target="_blank"
                                                                                                                href="https://viewstripo.email"
                                                                                                                style="
                                                                                                                    -webkit-text-size-adjust: none;
                                                                                                                    -ms-text-size-adjust: none;
                                                                                                                    mso-line-height-rule: exactly;
                                                                                                                    font-family: helvetica,
                                                                                                                        'helvetica neue',
                                                                                                                        arial,
                                                                                                                        verdana,
                                                                                                                        sans-serif;
                                                                                                                    font-size: 14px;
                                                                                                                    text-decoration: none;
                                                                                                                    display: block;
                                                                                                                    color: #3d5ca3;
                                                                                                                "
                                                                                                                >Blog</a
                                                                                                            >
                                                                                                        </td>
                                                                                                        <td
                                                                                                            style="
                                                                                                                margin: 0;
                                                                                                                padding-left: 5px;
                                                                                                                padding-right: 5px;
                                                                                                                padding-top: 0px;
                                                                                                                padding-bottom: 1px;
                                                                                                                border: 0;
                                                                                                                border-left: 1px
                                                                                                                    solid
                                                                                                                    #3d5ca3;
                                                                                                            "
                                                                                                            id="esd-menu-id-2"
                                                                                                            esdev-border-color="#3d5ca3"
                                                                                                            width="33.33%"
                                                                                                            valign="top"
                                                                                                            bgcolor="transparent"
                                                                                                            align="center"
                                                                                                        >
                                                                                                            <a
                                                                                                                target="_blank"
                                                                                                                href="https://viewstripo.email"
                                                                                                                style="
                                                                                                                    -webkit-text-size-adjust: none;
                                                                                                                    -ms-text-size-adjust: none;
                                                                                                                    mso-line-height-rule: exactly;
                                                                                                                    font-family: helvetica,
                                                                                                                        'helvetica neue',
                                                                                                                        arial,
                                                                                                                        verdana,
                                                                                                                        sans-serif;
                                                                                                                    font-size: 14px;
                                                                                                                    text-decoration: none;
                                                                                                                    display: block;
                                                                                                                    color: #3d5ca3;
                                                                                                                "
                                                                                                                >About
                                                                                                                us</a
                                                                                                            >
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="center"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                padding-bottom: 20px;
                                                                                                padding-left: 20px;
                                                                                                padding-right: 20px;
                                                                                                font-size: 0;
                                                                                            "
                                                                                        >
                                                                                            <table
                                                                                                width="100%"
                                                                                                height="100%"
                                                                                                cellspacing="0"
                                                                                                cellpadding="0"
                                                                                                border="0"
                                                                                                role="presentation"
                                                                                                style="
                                                                                                    mso-table-lspace: 0pt;
                                                                                                    mso-table-rspace: 0pt;
                                                                                                    border-collapse: collapse;
                                                                                                    border-spacing: 0px;
                                                                                                "
                                                                                            >
                                                                                                <tbody>
                                                                                                    <tr
                                                                                                        style="
                                                                                                            border-collapse: collapse;
                                                                                                        "
                                                                                                    >
                                                                                                        <td
                                                                                                            style="
                                                                                                                padding: 0;
                                                                                                                margin: 0;
                                                                                                                border-bottom: 1px
                                                                                                                    solid
                                                                                                                    #fafafa;
                                                                                                                background: none;
                                                                                                                height: 1px;
                                                                                                                width: 100%;
                                                                                                                margin: 0px;
                                                                                                            "
                                                                                                        ></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                class="es-footer"
                                cellspacing="0"
                                cellpadding="0"
                                align="center"
                                role="none"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    table-layout: fixed !important;
                                    width: 100%;
                                    background-color: transparent;
                                    background-repeat: repeat;
                                    background-position: center top;
                                "
                            >
                                <tbody>
                                    <tr style="border-collapse: collapse">
                                        <td
                                            style="
                                                padding: 0;
                                                margin: 0;
                                                background-color: #fafafa;
                                            "
                                            bgcolor="#fafafa"
                                            align="center"
                                        >
                                            <table
                                                class="es-footer-body"
                                                style="
                                                    mso-table-lspace: 0pt;
                                                    mso-table-rspace: 0pt;
                                                    border-collapse: collapse;
                                                    border-spacing: 0px;
                                                    background-color: transparent;
                                                    width: 600px;
                                                "
                                                cellspacing="0"
                                                cellpadding="0"
                                                bgcolor="transparent"
                                                align="center"
                                                role="none"
                                            >
                                                <tbody>
                                                    <tr
                                                        style="
                                                            border-collapse: collapse;
                                                        "
                                                    >
                                                        <td
                                                            align="left"
                                                            style="
                                                                margin: 0;
                                                                padding-bottom: 5px;
                                                                padding-top: 15px;
                                                                padding-left: 20px;
                                                                padding-right: 20px;
                                                            "
                                                        >
                                                            <table
                                                                width="100%"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            valign="top"
                                                                            align="center"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 560px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                "
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            align="center"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                            "
                                                                                        >
                                                                                            <p
                                                                                                style="
                                                                                                    margin: 0;
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-size: 12px;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    line-height: 18px;
                                                                                                    color: #666666;
                                                                                                "
                                                                                            >
                                                                                                This
                                                                                                daily
                                                                                                newsletter
                                                                                                was
                                                                                                sent
                                                                                                to
                                                                                                info@name.com
                                                                                                from
                                                                                                company
                                                                                                name
                                                                                                because
                                                                                                you
                                                                                                subscribed.
                                                                                                If
                                                                                                you
                                                                                                would
                                                                                                not
                                                                                                like
                                                                                                to
                                                                                                receive
                                                                                                this
                                                                                                email
                                                                                                <a
                                                                                                    target="_blank"
                                                                                                    style="
                                                                                                        -webkit-text-size-adjust: none;
                                                                                                        -ms-text-size-adjust: none;
                                                                                                        mso-line-height-rule: exactly;
                                                                                                        font-family: helvetica,
                                                                                                            'helvetica neue',
                                                                                                            arial,
                                                                                                            verdana,
                                                                                                            sans-serif;
                                                                                                        font-size: 12px;
                                                                                                        text-decoration: underline;
                                                                                                        color: #333333;
                                                                                                    "
                                                                                                    class="unsubscribe"
                                                                                                    href=""
                                                                                                    >unsubscribe
                                                                                                    here</a
                                                                                                >.
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                class="es-content"
                                cellspacing="0"
                                cellpadding="0"
                                align="center"
                                role="none"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    table-layout: fixed !important;
                                    width: 100%;
                                "
                            >
                                <tbody>
                                    <tr style="border-collapse: collapse">
                                        <td
                                            align="center"
                                            style="padding: 0; margin: 0"
                                        >
                                            <table
                                                class="es-content-body"
                                                style="
                                                    mso-table-lspace: 0pt;
                                                    mso-table-rspace: 0pt;
                                                    border-collapse: collapse;
                                                    border-spacing: 0px;
                                                    background-color: transparent;
                                                    width: 600px;
                                                "
                                                cellspacing="0"
                                                cellpadding="0"
                                                bgcolor="#ffffff"
                                                align="center"
                                                role="none"
                                            >
                                                <tbody>
                                                    <tr
                                                        style="
                                                            border-collapse: collapse;
                                                        "
                                                    >
                                                        <td
                                                            align="left"
                                                            style="
                                                                margin: 0;
                                                                padding-left: 20px;
                                                                padding-right: 20px;
                                                                padding-top: 30px;
                                                                padding-bottom: 30px;
                                                            "
                                                        >
                                                            <table
                                                                width="100%"
                                                                cellspacing="0"
                                                                cellpadding="0"
                                                                role="none"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tbody>
                                                                    <tr
                                                                        style="
                                                                            border-collapse: collapse;
                                                                        "
                                                                    >
                                                                        <td
                                                                            valign="top"
                                                                            align="center"
                                                                            style="
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                width: 560px;
                                                                            "
                                                                        >
                                                                            <table
                                                                                width="100%"
                                                                                cellspacing="0"
                                                                                cellpadding="0"
                                                                                role="presentation"
                                                                                style="
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-collapse: collapse;
                                                                                    border-spacing: 0px;
                                                                                "
                                                                            >
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="
                                                                                            border-collapse: collapse;
                                                                                        "
                                                                                    >
                                                                                        <td
                                                                                            class="es-infoblock made_with"
                                                                                            align="center"
                                                                                            style="
                                                                                                padding: 0;
                                                                                                margin: 0;
                                                                                                line-height: 14.4px;
                                                                                                font-size: 0;
                                                                                                color: #cccccc;
                                                                                            "
                                                                                        >
                                                                                            <a
                                                                                                target="_blank"
                                                                                                href="https://viewstripo.email/?utm_source=templates&amp;utm_medium=email&amp;utm_campaign=education&amp;utm_content=trigger_newsletter2"
                                                                                                style="
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    -ms-text-size-adjust: none;
                                                                                                    mso-line-height-rule: exactly;
                                                                                                    font-family: helvetica,
                                                                                                        'helvetica neue',
                                                                                                        arial,
                                                                                                        verdana,
                                                                                                        sans-serif;
                                                                                                    font-size: 12px;
                                                                                                    text-decoration: none;
                                                                                                    color: #cccccc;
                                                                                                "
                                                                                                ><img
                                                                                                    src="https://tlr.stripocdn.email/content/guids/cab_pub_7cbbc409ec990f19c78c75bd1e06f215/images/78411525331495932.png"
                                                                                                    alt
                                                                                                    style="
                                                                                                        display: block;
                                                                                                        border: 0;
                                                                                                        outline: none;
                                                                                                        text-decoration: none;
                                                                                                        -ms-interpolation-mode: bicubic;
                                                                                                    "
                                                                                                    width="125"
                                                                                            /></a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>

`;

exports.welcomeTemplate = welcomeTemplate;
exports.resetPasswordTemplate = resetPasswordTemplate;