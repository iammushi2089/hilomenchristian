// frontend/src/pages/GamePage.js
import { useState } from 'react';

const quizData = [
    {
        question: "Which country won the FIFA World Cup in 2018?",
        options: ["France", "Croatia", "Belgium", "England"],
        answer: 0,
        category: "⚽ Soccer"
    },
    {
        question: "Who holds the record for most Olympic gold medals?",
        options: ["Usain Bolt", "Carl Lewis", "Michael Phelps", "Mark Spitz"],
        answer: 2,
        category: "🏊 Swimming"
    },
    {
        question: "What is the national sport of the Philippines?",
        options: ["Basketball", "Boxing", "Arnis", "Volleyball"],
        answer: 2,
        category: "🇵🇭 Philippine Sports"
    },
    {
        question: "Which NBA player has won the most championship rings?",
        options: ["Michael Jordan", "Kareem Abdul-Jabbar", "Bill Russell", "LeBron James"],
        answer: 2,
        category: "🏀 Basketball"
    },
    {
        question: "What is the length of a marathon in kilometers?",
        options: ["38.2 km", "40.2 km", "42.2 km", "44.2 km"],
        answer: 2,
        category: "🏃 Running"
    },
    {
        question: "Which volleyball player is known as 'The Phenom' in the Philippines?",
        options: ["Michele Gumabao", "Alyssa Valdez", "Jaja Santiago", "Katherine Villegas"],
        answer: 1,
        category: "🏐 Volleyball"
    },
    {
        question: "How many players are on a basketball team on the court?",
        options: ["4", "5", "6", "7"],
        answer: 1,
        category: "🏀 Basketball"
    },
    {
        question: "Which boxer is known as 'The Greatest of All Time'?",
        options: ["Mike Tyson", "Manny Pacquiao", "Muhammad Ali", "Floyd Mayweather"],
        answer: 2,
        category: "🥊 Boxing"
    }
];

function GamePage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [gameComplete, setGameComplete] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const currentQuestion = quizData[currentQuestionIndex];

    const handleOptionSelect = (index) => {
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        
        if (selectedOption === currentQuestion.answer) {
            setScore(score + 1);
            setResultMessage('✅ Correct! Great job! 🎉');
        } else {
            setResultMessage(`❌ Wrong! The correct answer is: ${currentQuestion.options[currentQuestion.answer]}`);
        }
        
        setShowResult(true);
        
        setTimeout(() => {
            if (currentQuestionIndex + 1 < quizData.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
                setShowResult(false);
                setResultMessage('');
            } else {
                setGameComplete(true);
                if (score + (selectedOption === currentQuestion.answer ? 1 : 0) === quizData.length) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }
            }
        }, 1500);
    };

    const restartGame = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
        setResultMessage('');
        setGameComplete(false);
        setShowConfetti(false);
    };

    const styles = {
        container: {
            width: '90%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
        },
        hero: {
            color: 'white',
            textAlign: 'center',
            padding: '6rem 2rem',
            marginBottom: '3rem',
            borderRadius: '0 0 15px 15px',
            background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/lasallevsateneo.jpg') center/cover no-repeat"
        },
        heroH1: {
            fontSize: '3rem',
            marginBottom: '1.5rem',
            color: 'white'
        },
        heroP: {
            fontSize: '1.2rem',
            maxWidth: '700px',
            margin: '0 auto 2rem',
            opacity: 0.9
        },
        gameContainer: {
            maxWidth: "800px",
            margin: "2rem auto",
            padding: "2rem",
            background: "var(--card-bg, #ffffff)",
            borderRadius: "15px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
            textAlign: "center"
        },
        title: {
            color: "var(--primary-color, #1D546C)",
            marginBottom: "0.5rem",
            fontSize: "2.5rem"
        },
        subtitle: {
            marginBottom: "2rem",
            fontSize: "1rem",
            opacity: 0.8,
            color: "var(--text, #111827)"
        },
        quizCard: {
            background: "var(--bg, #f5f5f5)",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            margin: "20px 0"
        },
        category: {
            display: "inline-block",
            background: "var(--primary-color, #1D546C)",
            color: "white",
            padding: "5px 15px",
            borderRadius: "20px",
            fontSize: "0.9rem",
            marginBottom: "15px"
        },
        questionNumber: {
            color: "var(--primary-color, #1D546C)",
            fontSize: "1rem",
            marginBottom: "10px",
            fontWeight: "bold"
        },
        question: {
            fontSize: "1.5rem",
            marginBottom: "25px",
            color: "var(--text, #111827)",
            minHeight: "80px"
        },
        optionsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
            marginBottom: "25px"
        },
        option: {
            background: "var(--card-bg, #ffffff)",
            border: "2px solid var(--muted-border, #e0e0e0)",
            borderRadius: "8px",
            padding: "15px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "1rem",
            color: "var(--text, #111827)",
            textAlign: "center"
        },
        selectedOption: {
            background: "var(--primary-color, #1D546C)",
            border: "2px solid var(--primary-color, #1D546C)",
            color: "white"
        },
        submitButton: {
            background: "var(--primary-color, #1D546C)",
            color: "white",
            border: "none",
            padding: "15px 40px",
            fontSize: "1.1rem",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            marginTop: "10px",
            cursor: "pointer",
            fontWeight: "bold"
        },
        submitButtonDisabled: {
            opacity: 0.6,
            cursor: "not-allowed"
        },
        resultBox: {
            marginTop: "25px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            padding: "15px",
            borderRadius: "8px",
            background: "rgba(251, 191, 36, 0.1)",
            borderLeft: "4px solid var(--accent-color, #fbbf24)"
        },
        scoreDisplay: {
            fontSize: "1.3rem",
            color: "var(--primary-color, #1D546C)",
            margin: "20px 0",
            fontWeight: "bold"
        },
        finalScore: {
            fontSize: "2rem",
            color: "var(--accent-color, #fbbf24)",
            margin: "30px 0",
            padding: "20px",
            background: "var(--bg, #f5f5f5)",
            borderRadius: "10px",
            border: "3px solid var(--primary-color, #1D546C)"
        },
        message: {
            margin: "20px 0",
            fontSize: "1.1rem",
            lineHeight: "1.6"
        },
        playAgainButton: {
            background: "var(--accent-color, #fbbf24)",
            color: "#1D546C",
            border: "none",
            padding: "15px 40px",
            fontSize: "1.1rem",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontWeight: "bold",
            marginTop: "20px"
        },
        instructionsBox: {
            marginTop: "30px",
            padding: "20px",
            background: "var(--bg, #f5f5f5)",
            borderRadius: "10px",
            textAlign: "left"
        },
        instructionsTitle: {
            color: "var(--primary-color, #1D546C)",
            marginBottom: "10px"
        },
        instructionsList: {
            paddingLeft: "20px",
            margin: "10px 0"
        },
        confetti: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1000,
            fontSize: "3rem",
            textAlign: "center",
            paddingTop: "100px"
        }
    };

    return (
        <main style={styles.container}>
            {/* Hero Section */}
            <section style={styles.hero} className="fade-in">
                <h1 style={styles.heroH1}>Sports <span style={{ color: 'yellow' }}>Quiz Challenge</span></h1>
                <p style={styles.heroP}>Test your sports knowledge with our fun and challenging quiz!</p>
            </section>

            {showConfetti && (
                <div style={styles.confetti}>
                    🎉🏆🎊✨🏅🎉
                </div>
            )}

            <div style={styles.gameContainer}>
                <h2 style={styles.title}>🏆 Sports Quiz</h2>
                <p style={styles.subtitle}>Test your knowledge about sports from around the world!</p>
                
                <div style={styles.quizCard}>
                    {!gameComplete ? (
                        <>
                            <div style={styles.category}>
                                {currentQuestion.category}
                            </div>
                            <div style={styles.questionNumber}>
                                Question {currentQuestionIndex + 1} of {quizData.length}
                            </div>
                            <h3 style={styles.question}>
                                {currentQuestion.question}
                            </h3>
                            
                            <div style={styles.optionsGrid}>
                                {currentQuestion.options.map((option, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        style={{
                                            ...styles.option,
                                            ...(selectedOption === idx ? styles.selectedOption : {})
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedOption !== idx) {
                                                e.target.style.background = "var(--primary-color, #1D546C)";
                                                e.target.style.color = "white";
                                                e.target.style.transform = "scale(1.02)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedOption !== idx) {
                                                e.target.style.background = "var(--card-bg, #ffffff)";
                                                e.target.style.color = "var(--text, #111827)";
                                                e.target.style.transform = "scale(1)";
                                            }
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                onClick={handleSubmit}
                                disabled={selectedOption === null}
                                style={{
                                    ...styles.submitButton,
                                    ...(selectedOption === null ? styles.submitButtonDisabled : {})
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedOption !== null) {
                                        e.target.style.background = "#0C2B4E";
                                        e.target.style.transform = "scale(1.05)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "var(--primary-color, #1D546C)";
                                    e.target.style.transform = "scale(1)";
                                }}
                            >
                                Submit Answer
                            </button>
                            
                            {showResult && (
                                <div style={styles.resultBox}>
                                    {resultMessage}
                                </div>
                            )}
                            
                            <div style={styles.scoreDisplay}>
                                Score: {score}/{quizData.length}
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={styles.finalScore}>
                                Final Score: {score}/{quizData.length}
                            </div>
                            <div style={styles.message}>
                                {score === quizData.length ? (
                                    <>
                                        🎉🏆 PERFECT SCORE! 🏆🎉<br />
                                        You're a true sports expert! Amazing knowledge!
                                    </>
                                ) : score >= quizData.length * 0.7 ? (
                                    <>
                                        👍 GREAT JOB! 👍<br />
                                        You know your sports well! Keep learning more!
                                    </>
                                ) : score >= quizData.length * 0.5 ? (
                                    <>
                                        😊 GOOD EFFORT! 😊<br />
                                        You have decent sports knowledge. Play again to improve!
                                    </>
                                ) : (
                                    <>
                                        💪 KEEP PRACTICING! 💪<br />
                                        Sports are exciting to learn about. Try again to boost your score!
                                    </>
                                )}
                            </div>
                            <button
                                onClick={restartGame}
                                style={styles.playAgainButton}
                                onMouseEnter={(e) => {
                                    e.target.style.background = "#f59e0b";
                                    e.target.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "var(--accent-color, #fbbf24)";
                                    e.target.style.transform = "scale(1)";
                                }}
                            >
                                Play Again 🔄
                            </button>
                        </>
                    )}
                </div>
                
                <div style={styles.instructionsBox}>
                    <h3 style={styles.instructionsTitle}>🎯 How to Play:</h3>
                    <ul style={styles.instructionsList}>
                        <li>Read each sports-related question carefully</li>
                        <li>Select your answer from the options provided</li>
                        <li>Click "Submit Answer" to check your response</li>
                        <li>Complete all {quizData.length} questions to see your final score</li>
                        <li>Aim for a perfect score to prove your sports expertise!</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}

export default GamePage;