module.exports = {
    iceBreakers: [
        {
            call_to_actions:
                [
                    {
                        question: "Price",
                        payload: "COLOUR"
                    },
                    {
                        question: "Time",
                        payload: "PRICE"
                    },
                    {
                        question: "Quality",
                        payload: "QUALITY"
                    }
                ],
            locale: "default"
        },
        {
            call_to_actions:
                [
                    {
                        question: "Стойкость краски 🎨",
                        payload: "COLOUR"
                    },
                    {
                        question: "Цена💸",
                        payload: "PRICE"
                    },
                    {
                        question: "Какую одежду можно расписывать?👕",
                        payload: "CLOTHES"
                    },
                    {
                        question: "Связаться с человеком",
                        payload: "HUMAN_AGENT"
                    }
                ],
            locale: "ru_RU"
        }

    ],

    colourResponse: {
        'text': 'Я использую специальную акриловую краску по ткани. Она НЕ СМЫВАЕТСЯ!\n' +
            '👉Главное придерживаться рекомендаций по уходу',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Рекомендации по уходу",
                "payload": "RECOMMENDATIONS"
            },
            {
                "content_type": "text",
                "title": "Виды красок",
                "payload": "TYPES_OF_COLOUR"
            },
            {
                "content_type": "text",
                "title": "Время работы⏰",
                "payload": "TIME"
            },
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    recommendationResponse: {
        'text': '-Деликатный режим/режим ручной стирки\n' +
            '-Передстиркой выверните вещь наизнанку\n' +
            '-Вода не более 30°\n' +
            '-Минимальный отжим\n' +
            '-Не используйте отбеливающие средства\n' +
            '-Утюжить место с рисунком через хлопковую ткань или с изнаночной стороны( утюг не должен касаться рисунка)\n' +
            '-Храните вещи на плечиках\n' +
            '-Не допускайте смятия рисунка при хранении\n' +
            '-Не допускайте длительного контакта рисунка с горячими поверхностями(с кожаными сидениями в жаркую погоду)',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    typesOfColoursResponse: {
        'text': '🖌На прилавке представлены краски десятка фирм, но я отдаю своё предпочтение в основном DEC0LA и РЕВЕО, это фавориты. DECOLA предназначена для натуральных тканей( хлопок, лён). PEBEO как для натуральных, так и для искусственных( полиэстер, болонь, плащевка, кожа)\n' +
            '\n' +
            '🎨Цветовая гамма огромная, в том числе флюоресцентные краски и люминесцентные уже других производителей.\n' +
            '\n' +
            '👩‍🎨Также я использую специальные баллончики с краской для одежды, что дает возможность создавать эффект граффити.',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    priceResponse: {
        'text': 'Стоимость заказа рассчитывается индивидуально с каждым покупателем🥰\n' +
            'Зависит от:\n' +
            '-сложности работы\n' +
            '-объема работы\n' +
            '-от материала и цвета одежды\n' +
            '-времени, потраченному на роспись\n' +
            '\n' +
            'Приблизительную стоимость твоей задумки мы оговорим после составления макета. Кстати, макетики я составляю совершенно бесплатно😉\n' +
            'Просто расскажи мне свою идею и мы создадим 💣🔥',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Доставка и оплата",
                "payload": "DELIVERING_AND_PAYMENT"
            },
            {
                "content_type": "text",
                "title": "Время работы⏰",
                "payload": "TIME"
            },
            {
                "content_type": "text",
                "title": "Скидки и сертификаты",
                "payload": "DISCOUNT"
            },
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    timeResponse: {
        'text': 'Время работы зависи от сложности работы и срочности исполнения заказа. Обсуждается в индивидуальном порядке 😏\n' +
            'Срочный заказы от 2-5 дней\n' +
            'Обычные от 3 до 14 дней\n',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    clothesResponse: {
        'text': '👕Расписывать можно преимущественно хлопковые вещи, чем больше процент хлопка, тем легче ложатся краски.(для худи, футболок, джинсовок, джинс лучше всего 100% хлопок)\n' +
            '\n' +
            '🧥Однако можно расписывать одежду практически любого состава\n' +
            '(Плащевка, болонья, полиэстер, кожа)',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Список вещей для росписи",
                "payload": "CLOTHES_LIST"
            },
            {
                "content_type": "text",
                "title": "Где купить?",
                "payload": "PLACE_TO_BUY"
            },
            {
                "content_type": "text",
                "title": "Как передать?",
                "payload": "HOW_TO_DELIVER"
            },
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    clothesListResponse: {
        'text': 'Список вещей, которые можно кастомизировать:\n' +
            '\n' +
            'Джинсы\n' +
            'Шорты\n' +
            'Юбки\n' +
            'Брюки\n' +
            '\n' +
            'Пиджаки\n' +
            'Худи\n' +
            'Футболки\n' +
            'Рубашки\n' +
            'Боди\n' +
            '\n' +
            'Куртки\n' +
            'Пальто\n' +
            'Джинсовки\n' +
            'Кожанки\n' +
            '\n' +
            'Медицинские халаты\n' +
            'Купальники\n' +
            'Белье☺\n' +
            'Шопперы\n' +
            'Галстуки\n' +
            'Защитные маски\n' +
            'Чемоданы\n' +
            '\n' +
            'Обувь( пока только тканевую(конверсы,вансы)\n' +
            'По поводу кожаной обуви лучше уточняйте\n' +
            'И многое другое, буду рада вашим предложениям🤗',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    placeToBuyResponse: {
        'text': '☺Я могу помочь в выборе и покупке вещи. Тебе просто надо написать мне размер и согласовать модель.\n' +
            'Я же скажу сколько она стоит в магазине и могу сама ее купить( в этом случае потребуется предоплата)\n' +
            '\n' +
            '🌚Если же вы сами хотите выбрать вещь, то я подготовила список магазинов, где вы точно сможете найти всё необходимое:\n' +
            '\n' +
            '1. Масс маркет:\n' +
            'Н&М, NewYorker, bershka, Zara, Ooji, Ostin, Stradivarius, Befree, Mango, Loverepublic, Твоё, Свитанок, Купалинка, Марк Формель.\n' +
            '\n' +
            'В последних четырех будут качественные именно хлопковые футболки.\n' +
            '\n' +
            '2. Интернет-магазины:\n' +
            'Wildberries(мой любимый),\n' +
            'Lamoda,\n' +
            'Ozon.\n' +
            '\n' +
            '👉На мой взгляд самыми удобными являются интернет-магазины, потому что там бесплатная доставка.\n' +
            'При желании вы можете и померять вещь у себя в городе и сами заказать на мой пункт выдачи.\n' +
            '\n' +
            'Самое главное в интернет-магазинах- читайте отзывы.😁🙃',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    howToDeliverResponse: {
        'text': '- почтой\n' +
            '- при личной встрече( Витебск, Барановичи, Минск)\n' +
            '-через онлайн магазин( доставка на мой ближайший пункт выдачи)',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Доставка и оплата",
                "payload": "DELIVERING_AND_PAYMENT"
            },
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    deliveringAndPaymentResponse: {
        'text': '📨Доставка:\n' +
            '- белпочтой(+6р)\n' +
            '- европочтой(+4р)\n' +
            '- при личной встрече( Витебск, Барановичи, Минск)\n' +
            '\n' +
            '💰Оплата:\n' +
            'Предоплата 1/3 всей стоимости\n' +
            'Остальная часть после выполнения работы, перед пересылкой.\n' +
            '- наложенным платежом через почту\n' +
            '-перевод на карту\n' +
            '-наличными',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    discountResponse: {
        'text': 'Получи скидку 5% прямо сейчас 🤑\n' +
            '\n' +
            '🥳Тебе всего лишь надо сделать репост любой понравившейся работы из профиля к себе в сторис, отметить @artiri_by.\n' +
            '\n' +
            'Если от твоей сторис прийдет 3\n' +
            'человека, то твоя скидка станет 7 %\n' +
            'А за 5 человек, то ты получишь скидку 10%!!!\n' +
            '\n' +
            'Заманчиво не правда ли😁😏',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Сертификаты 🤍",
                "payload": "CERTIFICATES"
            },
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    certificatesResponse: {
        'text': 'Сертификаты доступны на любую сумму. Имеют место как в бумажном, так и электронном формате.\n' +
            'Если сомневаетесь с идеей для подарка, то идеальным решением станет сертификат на роспись одежды 🤍',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Назад",
                "payload": "BACK"
            }
        ]
    },

    humanAgentResponse: {
        'text': 'Привет, меня зовут Ирина! Чем я могу тебе помочь?'
    },

    backResponse: {
        'text': 'Чем я могу Вам помочь?' +
            'Чтобы вызвать обратно меню, напишите + в чат',
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Стойкость краски 🎨",
                "payload": "COLOUR"
            },
            {
                "content_type": "text",
                "title": "Цена💸",
                "payload": "PRICE"
            },
            {
                "content_type": "text",
                "title": "Какую одежду можно расписывать?👕",
                "payload": "CLOTHES"
            },
            {
                "content_type": "text",
                "title": "Связаться с человеком",
                "payload": "HUMAN_AGENT"
            }
        ]
    }
}

