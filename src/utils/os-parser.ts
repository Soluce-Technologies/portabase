export default function detectOSWithUA(userAgent: string) {
    const osList = [
        {
            name: "Windows",
            keywords: ["Win", "NT", "Windows"],
            icon: {
                name: "microsoft-windows-icon",
                size: {
                    width: 24,
                    height: 0,
                },
            },
            showText: true,
        },
        {
            name: "Ubuntu",
            keywords: ["Ubuntu"],
            icon: {
                name: "ubuntu",
                size: {
                    width: 24,
                    height: 0,
                },
            },
            showText: true,
        },
        {
            name: "iOS",
            keywords: ["iOS"],
            icon: {
                name: "ios",
                size: {
                    width: 24,
                    height: 0,
                },
            },
            showText: false,
        },
        {
            name: "iPadOS",
            keywords: ["iPadOS", "iPad"],
            icon: {
                name: "ios",
                size: {
                    width: 24,
                    height: 0,
                },
            },
            showText: true,
        },
        {
            name: "MacOS",
            keywords: ["MacOS", "Macintosh", "Mac OS", "Mac OS X"],
            icon: {
                name: "macos",
                size: {
                    width: 0,
                    height: 16,
                },
            },
            showText: false,
        },
        {
            name: "Android",
            keywords: ["Android"],
            icon: {
                name: "android-icon",
                size: {
                    width: 24,
                    height: 0,
                },
            },
            showText: true,
        },
        {
            name: "Linux",
            keywords: ["X11", "Linux"],
            icon: {
                name: "linux-tux",
                size: {
                    width: 24,
                    height: 0,
                },
            },
            showText: true,
        },
        {
            name: "Playstation 4",
            keywords: ["PlayStation 4"],
            showText: true,
        },
        {
            name: "Playstation 5",
            keywords: ["PlayStation 5"],
            showText: true,
        },
        {
            name: "Xbox Series X",
            keywords: ["Xbox Series X"],
            showText: true,
        },
        {
            name: "Xbox One S",
            keywords: ["XBOX_ONE_ED"],
            showText: true,
        },
        {
            name: "Xbox One",
            keywords: ["Xbox One"],
            showText: true,
        },
        {
            name: "Nintendo Switch",
            keywords: ["Nintendo Switch"],
            showText: true,
        },
        {
            name: "AppleTV",
            keywords: ["AppleTV"],
            icon: {
                name: "apple",
                size: {
                    width: 24,
                    height: 0,
                },
            },
            showText: true,
        },
    ];

    for (let os of osList) {
        if (os.keywords.some((keyword) => userAgent.includes(keyword))) {
            return os;
        }
    }

    return {
        name: "Unknown OS",
        icon: {
            name: "unknown",
            size: {
                width: 24,
                height: 0,
            },
        },
        showText: true,
    };
}
