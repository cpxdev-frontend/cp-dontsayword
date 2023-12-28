import React from 'react'
import Shake from 'shake.js'

var ready;
var shake;

const Game = ({round, time, setRound, setWin, setLose, setPrank, setScore, maxRound}) => {
    const [secondsLeft, setSecondsLeft] = React.useState(500);
    const [prewoningame, setPrewon] = React.useState(false);
    const [word, setWord] = React.useState('');
    const [startstate, setStart] = React.useState(false);
    const [screen, setScreen] = React.useState([window.innerWidth, window.innerHeight]);
    const [won, setWon] = React.useState(false);
    const [readyhold, setHold] = React.useState(1000);
    const [prankcurrent, setPrankCurrent] = React.useState(0);

    React.useEffect(() => {
        fetch(encodeURI('https://cpxstatusservice.azurewebsites.net/wordrandom'), {
            method: 'post', // or 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                if (data.status == true && word == "") {
                    setWord(data.word)
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }, [])

    React.useEffect(() => {
        setScreen([window.innerWidth, window.innerHeight])
    }, [screen])

    const start = () => { 
console.log(new Date())
    }
    const changegamewon = () => {
        setPrank(prankcurrent)
        setWin(1)
        if (round == maxRound) {
            setRound(null)
        } else {
            setRound(round + 1)
        }
    }
    const changegamelose = () => {
        setPrank(prankcurrent)
        if (round == maxRound) {
            setRound(null)
        } else {
            setRound(round + 1)
        }
    }

    window.addEventListener('shake', shakeEventDidOccur, false);

    function shakeEventDidOccur () {
        window.removeEventListener('shake', shakeEventDidOccur, false);
        setPrewon(true)
        setScore(2)
        setHold(5000000000000);
    }

  React.useEffect(() => {
    ready = setInterval(() => {
        if (secondsLeft == 500) {
            setSecondsLeft(500)
        } else {
            setSecondsLeft(secondsLeft - 1);
            if (time == secondsLeft && startstate == true) {
                shake = new Shake({
                    threshold: 15, // optional shake strength threshold
                    timeout: 1000 // optional, determines the frequency of event generation
                });
                shake.start();
            }
            if (secondsLeft === 0) {
                if (startstate == false) {
                    setSecondsLeft(time)
                    setStart(true)
                    start()
                } else {
                    setStart(null)
                    setWon(true)
                    setHold(5000000000000);
                }
            }
        }
    }, readyhold);

    return () => clearInterval(ready);
  }, [secondsLeft]);

  const colorprogress = () => {
    if (startstate == true) {
        const maxper = (80 / 100) * time
        const half = (50 / 100) * time
        const less = (20 / 100) * time

        if (secondsLeft <= time && secondsLeft > maxper) {
            return 'bg-primary'
        } else if (secondsLeft <= maxper && secondsLeft > half) {
            return 'bg-success'
        } else if (secondsLeft <= half && secondsLeft > less) {
            return 'bg-warning'
        } else {
            return 'bg-danger'
        }
    } else {
        return ''
    }
  }


    return ( <div className='container'>
 <div classname="card">
    {startstate != null ? (
      <div classname="card-body d-flex justify-content-center">
        <h2 classname="card-title">{startstate ? 'คำที่ได้: ' + word : 'กดเพื่อเริ่มเกม'}</h2>
        {
            startstate && (
                <p>หากในรอบนี้เหลือผู้เล่นคนนี้คนเดียว ให้กดปุ่ม "คลิกเมื่อคุณชนะ" หรือให้คนที่ถือจอนี้อยู่เขย่ามือถือเพื่อหยุดเวลาและทายคำที่อยู่ด้านบนเพื่อรับคะแนนพิเศษ (หากทายถูกได้ 2 คะแนน ทายผิดจะได้รับ 1 คะแนน)</p>
            )
        }
        <div class="progress mb-3"style={{height: '3px'}}>
          <div class={"progress-bar " + colorprogress()} role="progressbar" style={{width: ((secondsLeft / (startstate == true ? time : 5)) * 100) +'%'}}></div>
        </div>
        {
            startstate == false && secondsLeft > 5 && (
                <button type="button" disabled={word == ''} onClick={()=>setSecondsLeft(5)} className="btn btn-lg btn-success">เริ่มเกมรอบที่ {round}</button>
            )
        }
        {startstate == false && secondsLeft > 5 ? (
            <></>
        ) : (
            <h4 style={{color: startstate && secondsLeft <= (20 / 100) * time ? 'red' : ''}}>{startstate == true ? 'เหลือเวลาอีก' : 'เกมจะเริ่มใน'} {secondsLeft} วินาที {startstate == false && '(คำจะปรากฎด้านบน)'}</h4>
        )}
        {startstate == true && prewoningame == false && secondsLeft < (90 / 100) * time && (
              <div class="btn-group mt-4" role="group" aria-label="Basic example" hidden={screen[0] > screen[1]}>
              <button type="button" class="btn btn-success" onClick={() => {
                setPrewon(true)
                setHold(5000000000000);
              }}>คลิกเมื่อคุณชนะ (คุณเป็นผู้เล่นที่เหลือคนสุดท้ายในรอบนี้)</button>
              <button type="button" class="btn btn-danger" onClick={() => {
                 setStart(null)
                 setHold(5000000000000);
                 setLose(1)
              }}>คลิกเมื่อคุณแพ้</button>
          </div>
        )}
        {prewoningame && (
            <>
            <hr />
              <div class="form-group" hidden={screen[0] > screen[1]}>
                <label for="exampleInputEmail1">กรอกคะแนนที่คุณได้ในรอบนี้ (ระบุจำนวนเพื่อนที่คุณแกงให้แพ้เกมในรอบนี้สำเร็จเท่านั้น)</label>
                <input type="number" class="form-control" onKeyUp={(e) => setPrankCurrent(e.target.value != '' && parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)} defaultValue={prankcurrent} />
            </div>
            <div class="btn-group mt-4" role="group" aria-label="Basic example" hidden={screen[0] > screen[1]}>
                <button type="button" class="btn btn-success" onClick={() => {
                    setScore(2)
                    changegamewon()
                }}>คุณทายถูก</button>
                <button type="button" class="btn btn-danger" onClick={() => {
                    setScore(1)
                    setWin(1)
                    changegamelose()
                }}>คุณทายผิด</button>
            </div>
            </>
        )}
      </div>
    ) : (
        <>
        {won ? (
            <div classname="card-body d-flex justify-content-center">
            <h2 classname="card-title">{'คำที่ได้: ' + word}</h2>
            <hr />
            <h4>It's your chance! หมดเวลาในรอบนี้แล้ว ผู้เล่นที่ถือจอนี้อยู่ต้องทายคำด้านบนนี้ให้ได้ (หากทายถูกได้ 2 คะแนน ทายผิดจะได้รับ 1 คะแนน)</h4>
            <div class="form-group" hidden={screen[0] > screen[1]}>
                <label for="exampleInputEmail1">กรอกคะแนนที่คุณได้ในรอบนี้ (ระบุจำนวนเพื่อนที่คุณแกงให้แพ้เกมในรอบนี้สำเร็จเท่านั้น)</label>
                <input type="number" class="form-control" onKeyUp={(e) => setPrankCurrent(e.target.value != '' && parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)} defaultValue={prankcurrent} />
            </div>
            <div class="btn-group mt-4" role="group" aria-label="Basic example" hidden={screen[0] > screen[1]}>
                <button type="button" class="btn btn-success" onClick={() => {
                    setScore(2)
                    changegamewon()
                }}>คุณทายถูก</button>
                <button type="button" class="btn btn-danger" onClick={() => {
                    setScore(1)
                    setWin(1)
                    changegamelose()
                }}>คุณทายผิด</button>
            </div>
          </div>
        ) : (
            <div classname="card-body d-flex justify-content-center">
                <h2 classname="card-title">คุณแพ้เกมในรอบนี้ (คุณไม่ได้รับคะแนนในคำนี้)</h2>
                <p class="card-text">ระหว่างนี้คุณสามารถหลอกล่อหรือแกงเพื่อนให้แพ้ได้ หากผู้ล่นตรงข้ามคนใดแพ้โดยคุณเท่ากับ 1 คะแนน โดยสามารถกรอกจำนวนผู้เล่นที่เราทำให้แพ้ได้ (สามารถแก้ไขได้เรื่อยๆจนกว่าจะมีผู้ชนะคนเดียวหรือจบเกม แต่ห้ามกดยืนยันการเล่นรอบถัดไปจนกว่าจะจบรอบเกมนั้นๆ การกดยืนยันเปลี่ยนรอบระบบจะบันทึกคะแนนที่ได้ในรอบนั้นๆ)</p>
                <h4>คำที่คุณได้: {word}</h4>
                <hr hidden={screen[0] > screen[1]} />
                <div class="form-group" hidden={screen[0] > screen[1]}>
                    <label for="exampleInputEmail1">กรอกคะแนนที่คุณได้ในรอบนี้ (สามารถแก้ไขช่องนี้ได้ตลอดเวลาหากคะแนนเปลี่ยน แต่ยังไม่ต้องกดบันทึกจนกว่าจะจบรอบเกมนี้)</label>
                    <input type="number" class="form-control" onKeyUp={(e) => setPrankCurrent(e.target.value != '' && parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)} defaultValue={prankcurrent} />
                </div>
                <a class="btn btn-primary" hidden={screen[0] > screen[1]} onClick={()=>{
                    changegamelose();
                }}>บันทึกคะแนนและเปลี่ยนรอบถัดไป</a>
            </div>
        )}
        </>
    )}
  </div>
    </div> );
}
 
export default Game;