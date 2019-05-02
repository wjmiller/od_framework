const AppData = {
  theme: 'dark',
  path: 'Core Strategy > Lesson 12',
  title: "Basic Candlesticks: The Life of a Candle",
  instructor: 'Merlin Rothfeld',
  video: {
    poster: 'life_of_candle.png',
    sources: [
      'life_of_candle.mp4'
    ]
  },
  objectives: [
    'Correctly identify high, low, open, and close values in a candlestick',
    'Transform price values into a candlestick',
    'Recognize meaning of candlestick formations'
  ],
  activities: [{
      id: "samecandle",
      title: "Build a Candle Activity 1",
      candles: [{
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['10', '11', '12', '13', '14', '15'],
              timeLabel: 'Hr',
              pricePoints: [4, 5, 2, 8, 3, 6]
            }
          },
          feedback: {}
        },
        {
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['2/22', '2/25', '2/26', '2/27', '2/28'],
              timeLabel: 'Day',
              pricePoints: [4, 2, 3, 8, 6]
            }
          },
          feedback: {}
        }
      ],
      questions: [{
        instruction: "Build the candles in this group correctly to view the question.",
        question: "Why are the two candles the same even though the two charts are different time frames?",
        feedback: {
          correct: "Even though there are two different time frames, the two candles have the exact same open, close, high and low values.",
        }
      }]
    },
    {
      id: "nowick",
      title: "Build a Candle Activity 2",
      candles: [{
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['2/22', '2/25', '2/26', '2/27', '2/28'],
              timeLabel: 'Day',
              pricePoints: [10, 4, 3, 10, 3]
            }
          },
          feedback: {}
        },
        {
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['10', '11', '12', '13', '14', '15'],
              timeLabel: 'Hr',
              pricePoints: [5, 5, 7, 6, 7, 8]
            }
          },
          feedback: {}
        }
      ],
      questions: [{
        instruction: "Build the candles in this group correctly to view the question.",
        question: "What does a candlestick tell you when no wick is showing?",
        feedback: {
          correct: "When no wick is showing, it means that the high and low are also the opening and closing value of the candle.",
        }
      }]
    },
    {
      id: "differentcolor",
      title: "Build a Candle Activity 3",
      candles: [{
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['10', '11', '12', '13', '14', '15'],
              timeLabel: 'Hr',
              pricePoints: [3, 1, 5, 6, 4, 9]
            }
          },
          feedback: {}
        },
        {
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['2/22', '2/25', '2/26', '2/27', '2/28'],
              timeLabel: 'Day',
              pricePoints: [9, 1, 5, 1, 3]
            }
          },
          feedback: {}
        }
      ],
      questions: [{
        instruction: "Build the candles in this group correctly to view the question.",
        question: "If the wicks of two candles are the same and the bodies have the same range but one is red and one is green, what does it mean?",
        feedback: {
          correct: "Two candles with the same range means that the high and low values were the same, but the opening and closing values are reversed. The bottom of the green candle is the opening and the top the closing. The bottom of the red candle is the closing and the top the opening.",
        }
      }]
    },
    {
      id: "shortbodywick",
      title: "Build a Candle Activity 4",
      candles: [{
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['10', '11', '12', '13', '14', '15'],
              timeLabel: 'Hr',
              pricePoints: [9, 10, 10, 9, 7, 8]
            }
          },
          feedback: {}
        },
        {
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['2/22', '2/25', '2/26', '2/27', '2/28'],
              timeLabel: 'Day',
              pricePoints: [3, 2, 3, 4, 5]
            }
          },
          feedback: {}
        }
      ],
      questions: [{
        instruction: "Build the candles in this group correctly to view the question.",
        question: "What do short candle bodies with short wicks tell you about price in the represented time period?",
        feedback: {
          correct: "Short bodies with short wicks tell you that price did not change much in the represented time period.",
        }
      }]
    },
    {
      id: "shortbodylongwick",
      title: "Build a Candle Activity 5",
      candles: [{
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['10', '11', '12', '13', '14', '15'],
              timeLabel: 'Hr',
              pricePoints: [4, 2, 1, 7, 10, 6]
            }
          },
          feedback: {}
        },
        {
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['2/22', '2/25', '2/26', '2/27', '2/28'],
              timeLabel: 'Day',
              pricePoints: [7, 9, 2, 1, 6]
            }
          },
          feedback: {}
        }
      ],
      questions: [{
        instruction: "Build the candles in this group correctly to view the question.",
        question: "What do short candle bodies with long wicks tell you about price in the represented time period?",
        feedback: {
          correct: "Short bodies and long wicks tell you that price fluctuated greatly in the represented time period, but the opening and closing price were not very different.",
        }
      }]
    },
    {
      id: "longbodywick",
      title: "Build a Candle Activity 6",
      candles: [{
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['10', '11', '12', '13', '14', '15'],
              timeLabel: 'Hr',
              pricePoints: [2, 5, 2, 8, 3, 10]
            }
          },
          feedback: {}
        },
        {
          pricechart: {},
          candlechart: {
            cdata: {
              prices: [10, 8, 6, 4, 2, 0],
              timeIntervals: ['2/22', '2/25', '2/26', '2/27', '2/28'],
              timeLabel: 'Day',
              pricePoints: [9, 4, 5, 1, 2]
            }
          },
          feedback: {}
        }
      ],
      questions: [{
        instruction: "Build the candles in this group correctly to view the question.",
        question: "What do long candle bodies with small or no wicks tell you about the change of price in the given time period?",
        feedback: {
          correct: "Long candle bodies tell you that the opening and closing prices moved a great distance. Green bodies indicate that the closing price was much greater than the opening and red bodies indicate that the closing price was a lot less that the opening.",
        }
      }]
    }
  ]
}
export default AppData
