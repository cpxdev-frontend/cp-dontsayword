import logo from './logo.svg';
import './App.css';
import React,{ useState } from 'react';
import GameRoom from './gameroom'

var loadstart;

function App() {
  const [id, setID] = useState(null)
  const [loadState, setLoad] = useState(true)
  const [player, setAddPlayer] = useState([])
  const [cplay, setCplay] = useState('')

  const [Round, setRound] = useState(6)
  const [time, setTime] = useState(300)

  const [step, setStep] = useState(0)

  const [won, setWon] = useState(0)
  const [prank, setPrank] = useState(0)
  const [lose, setLose] = useState(0)
  const [score, setScore] = useState(0)

  React.useEffect(() => {
    fetch(encodeURI('https://cpxdevservice.onrender.com/wordrandom/getready' + (localStorage.getItem('player') !== null ? '/'+ localStorage.getItem('player'): '')), {
      method: 'post', // or 'PUT'
      })
      .then(response => response.json())
      .then(data => {
          setID(data.id)
          localStorage.setItem('player', data.id)
          setLoad(false)
      })
      .catch((error) => {
      console.error('Error:', error);
      });
  }, [])

  const LoadReady = () => {
    setLoad(true)
    loadstart = setInterval(() => {
      fetch(encodeURI('https://cpxdevservice.onrender.com/wordrandom/checkreadygame' + (id !== null ? '/'+ id: '')), {
        method: 'post', // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(player),
        })
        .then(response => response.json())
        .then(data => {
            if (data.st == true) {
              clearInterval(loadstart)
              setLoad(false)
              setStep(1)
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
      }, 500)
  }


if (step == 0) {
  return (
    <div className='container pt-5 mb-3'>
      <div classname="card">
      <div classname="card-body">
        <h2 classname="card-title">เกมคำต้องห้าม</h2>
        <h6 classname="card-subtitle text-muted">Designed by เทพลีลา Developed by CPXDev</h6>
        <h6 classname="card-subtitle mb-2 text-muted">ไอดีของคุณ: {id != null ? id : 'กำลังสร้างไอดีผู้เล่น'}</h6>
        <hr/>
        <p classname="card-subtitle mb-2">เกมสำหรับตั้งแต่ 2 คนขึ้นไป</p>
        <ul class="list-group mt-3">
          <li class="list-group-item active" aria-current="true">กติไก่ เอ๊ย! กติกา</li>
          <li class="list-group-item">1. การเล่นเกมจะแบ่งเป็น {Round} รอบ รอบละ {time} วินาที</li>
          <li class="list-group-item">2. ในแต่ละรอบระบบจะสุ่มคำขึ้นมา 1 คำ โดยระบบสุ่มคำแล้วจะยังไม่แสดงผลจนกว่าจะกดเริ่มเกม</li>
          <li class="list-group-item">3. หากกดเริ่มเกมในแต่ละรอบแล้วจะนับถอยหลัง 5 วินาทีเพื่อให้คุณหันจอไปยังฝ่ายตรงข้าม หลังจากนับถอยหลังครบแล้ว คำจะแสดงผล พร้อมกับการจับเวลา 5 นาที ถือว่าเป็นการเริ่มเกม</li>
          <li class="list-group-item">4. โดยที่คุณนั้นต้อง <b>ห้าม</b> พูดคำที่ปรากฎบนจอที่คุณถืออยู่ หากคุณเผลอพูดจะถือว่าคุณ<b>แพ้</b>ในรอบนั้นทันที</li>
          <li class="list-group-item">5. ในขณะเดียวกันคุณต้องทำให้ฝ่ายตรงข้ามพูดคำที่ปรากฎบนจอที่เขาถืออยู่ให้ได้ คุณถึงได้คะแนน (คนที่แพ้ในรอบนั้นก็สามารถเล่นได้เช่นกัน)</li>
          <li class="list-group-item">6. หากภายใน {time} วินาทีสามารถเหลือผู้รอดคนเดียว คนนั้นจะเป็นผู้ชนะในรอบนั้นและได้คะแนนเพิ่ม</li>
          <li class="list-group-item">7. ในกรณีที่หมดเวลาการแข่งขันในรอบนั้น (ครบ {time} วินาที) ผู้เล่นที่เหลือจะต้องทายคำที่ตัวเองถืออยู่ให้ถูก ถึงจะได้คะแนน</li>
          <li class="list-group-item">8. การแข่งขันจะเริ่มไปเรื่อยๆจนครบ {Round} รอบ หลังจากนั้นระบบจะแสดงคะแนนที่คุณบันทึกไว้ ใครได้คะแนนมากที่สุดเป็นผู้ชนะในเกมนั้น</li>
        </ul>
        <div className='card mb-5'>
            <div className='card-body'>
            <div class="form-group">
                    <label for="add">กรอกไอดีผู้เล่นของคนอื่น</label>
                    <input type="text" onKeyUp={(e) => {
                        setCplay(e.target.value.replace(' ', ''))
                    }} class="form-control" />
                    <button onClick={() => {
                        if (cplay != "" && player.filter(item => item == cplay).length == 0) {
                          setAddPlayer([...player, cplay.replace(' ', '')])
                          setCplay('')
                        } else {
                          alert('Please add your friend player ID.')
                        }
                    }} class="btn btn-lg btn-outline-success">Add</button>
                </div>
            </div>
            <ul className="list-group">
              {
                player.map((playerd) => (
                  <li className="list-group-item" onDoubleClick={() => setAddPlayer(player.filter(item => item !== playerd))}>{playerd} (ดับเบิ้ลคลิกที่นี่เพื่อลบไอดีนี้)</li>
                ))
              }
            </ul>
        </div>
        <div class="form-group mt-5">
                    <label for="exampleInputEmail1">หมายเหตุ: ในรูปแบบเกมปกติจะเล่น 6 รอบ โดยคุณสามารถปรับจำนวนรอบได้ตามความเหมาะสม (อย่าลืมปรึกษาเพื่อนก่อนเล่นด้วยนะ)</label>
                    <input type="number" class="form-control" onKeyUp={(e) => setRound(e.target.value != '' && parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 6)} defaultValue={Round} />
                </div>
                <div class="form-group mt-1">
                    <label for="exampleInputEmail2">หมายเหตุ: ในรูปแบบเกมปกติจะเล่นรอบละ 5 นาที (300 วินาที) โดยคุณสามารถปรับระยะเวลาได้ตามความเหมาะสม (อย่าลืมปรึกษาเพื่อนก่อนเล่นด้วยนะ)</label>
                    <input type="number" class="form-control" onKeyUp={(e) => setTime(e.target.value != '' && parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 300)} defaultValue={time} />
                </div>
        <button type="button" onClick={() => LoadReady()} class="mt-3 btn btn-lg btn-success" disabled={loadState}>เริ่มเกม!</button>
      </div>
  </div>
    </div>
  );
}
if (step == null) {
  return (
    <div className='container pt-5 mb-3'>
      <div classname="card">
      <div classname="card-body">
        <h2 classname="card-title">เกมคำต้องห้าม</h2>
        <h6 classname="card-subtitle mb-2 text-muted">Designed by เทพลีลา Developed by CPXDev</h6>
        <ul class="list-group mt-5">
          <li class="list-group-item active" aria-current="true">สรุปคะแนน</li>
          <li class="list-group-item">คุณชนะไปแล้ว {won} รอบ</li>
          <li class="list-group-item">คุณสามารถแกงเพื่อนให้แพ้ได้ {prank} ครั้ง</li>
          <li class="list-group-item">คุณแพ้ไปแล้ว {lose} รอบ</li>
          <li class="list-group-item bg-success text-light h5">คะแนนที่คุณทำได้ {score + prank} คะแนน</li>
        </ul>
        <button type="button" onClick={() => {
          if (id != null) {
            setStep(0)
            setWon(0)
            setPrank(0)
            setLose(0)
            setScore(0)
          }
        }} class="mt-3 btn btn-lg btn-outline-info" disabled={loadState}>เริ่มเกมใหม่</button>
      </div>
  </div>
    </div>
  );
}

  return (
    <>
    <nav class="navbar navbar-light bg-light mb-5">
      <span class="navbar-brand mb-0 h1">รอบที่ {step} / {Round}</span>
      <form class="form-inline"style={{width: window.innerWidth > window.innerHeight ? '10%' : '20%'}}>
        <div class="progress"style={{width: '100%'}}>
          <div class="progress-bar" role="progressbar" style={{width: ((step / Round) * 100) +'%'}}></div>
        </div>
        </form>
    </nav>
    <GameRoom key={step} time={time} loadState={loadState} setLoad={(v)=> setLoad(v)} maxRound={Round} round={step}  setRound={(v) => setStep(v)} setWin={(v) => setWon(won + v)} setLose={(v) => setLose(lose + v)} setPrank={(v) => setPrank(prank + v)} setScore={(v) => setScore(score + v)} />
    </>
  );
}

export default App;
