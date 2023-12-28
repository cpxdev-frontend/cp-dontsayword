import React from 'react'

var ready;

const Game = ({round, setRound, setWin, setLose, setPrank, maxRound}) => {
    const [secondsLeft, setSecondsLeft] = React.useState(500);
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

  React.useEffect(() => {
    ready = setInterval(() => {
        if (secondsLeft == 500) {
            setSecondsLeft(500)
        } else {
            setSecondsLeft(secondsLeft - 1);
            if (secondsLeft === 0) {
                if (startstate == false) {
                    setSecondsLeft(300)
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
        if (secondsLeft <= 300 && secondsLeft > 180) {
            return 'bg-primary'
        } else if (secondsLeft <= 180 && secondsLeft > 120) {
            return 'bg-success'
        } else if (secondsLeft <= 120 && secondsLeft > 15) {
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
        <div class="progress mb-3"style={{height: '3px'}}>
          <div class={"progress-bar " + colorprogress()} role="progressbar" style={{width: ((secondsLeft / (startstate == true ? 300 : 5)) * 100) +'%'}}></div>
        </div>
        {
            startstate == false && secondsLeft > 5 && (
                <button type="button" disabled={word == ''} onClick={()=>setSecondsLeft(5)} className="btn btn-success">เริ่มเกมรอบที่ {round}</button>
            )
        }
        {startstate == false && secondsLeft > 5 ? (
            <></>
        ) : (
            <h4 style={{color: startstate && secondsLeft <= 20 ? 'red' : ''}}>{startstate == true ? 'เหลือเวลาอีก' : 'เกมจะเริ่มใน'} {secondsLeft} วินาที {startstate == false && '(คำจะปรากฎด้านบน)'}</h4>
        )}
        {startstate == true && secondsLeft < 295 && (
              <div class="btn-group" role="group" aria-label="Basic example" hidden={screen[0] > screen[1]}>
              <button type="button" class="btn btn-success" onClick={() => changegamewon()}>คลิกเมื่อคุณชนะ (คุณเป็นผู้เล่นที่เหลือคนสุดท้ายในรอบนี้)</button>
              <button type="button" class="btn btn-danger" onClick={() => {
                 setStart(null)
                 setHold(5000000000000);
                 setLose(1)
              }}>คลิกเมื่อคุณแพ้</button>
          </div>
        )}
      </div>
    ) : (
        <>
        {won ? (
            <div classname="card-body d-flex justify-content-center">
            <h2 classname="card-title">{'คำที่ได้: ' + word}</h2>
            <hr />
            <h4>It's your chance! หมดเวลาในรอบนี้แล้ว ผู้เล่นที่ถือจอนี้อยู่ต้องทายคำด้านบนนี้ให้ได้ ถึงจะได้คะแนน</h4>
            <div class="form-group" hidden={screen[0] > screen[1]}>
                <label for="exampleInputEmail1">กรอกคะแนนที่คุณได้ในรอบนี้ (ระบุจำนวนเพื่อนที่คุณแกงให้แพ้เกมในรอบนี้สำเร็จเท่านั้น)</label>
                <input type="number" class="form-control" onKeyUp={(e) => setPrankCurrent(e.target.value != '' && parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)} defaultValue={prankcurrent} />
            </div>
            <div class="btn-group" role="group" aria-label="Basic example" hidden={screen[0] > screen[1]}>
                <button type="button" class="btn btn-success" onClick={() => changegamewon()}>ทายได้</button>
                <button type="button" class="btn btn-danger" onClick={() => {
                    setLose(1)
                    changegamelose()
                }}>ทายไม่ได้</button>
            </div>
          </div>
        ) : (
            <div classname="card-body d-flex justify-content-center">
                <h2 classname="card-title">คุณแพ้เกมในรอบนี้</h2>
                <p class="card-text">ระหว่างนี้คุณสามารถหลอกล่อหรือแกงเพื่อนให้แพ้ได้ โดยสามารถกรอกจำนวนผู้ที่เราทำให้แพ้ได้ (สามารถแก้ไขได้เรื่อยๆจนกว่าจะมีผู้ชนะคนเดียวหรือจบเกม แต่ห้ามกดยืนยันการเล่นรอบถัดไปจนกว่าจะจบรอบเกมนั้นๆ การกดยืนยันเปลี่ยนรอบระบบจะบันทึกคะแนนที่ได้ในรอบนั้นๆ)</p>
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