import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeerService } from 'src/app/services/peer.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
currentStream:any;
listUser:any[] = []
roomName:string 

  constructor(
      private route:ActivatedRoute,
      private webSocket:WebsocketService,
      private peerService:PeerService
  ) {
    this.roomName = route.snapshot.paramMap.get('id')
    console.log(this.roomName);
   }

  ngOnInit(): void {
    this.checkMediaDevices()
    this.initPeer()
    this.initSocket()
  }
  initPeer(){
    const {peer} = this.peerService
    peer.on('open', (id) => {
      const body ={
        idPeer:id,
        roomName:this.roomName
      }
      this.webSocket.joinRoom(body)
    });
    peer.on('call', callEnter =>{
      callEnter.answer(this.currentStream)
      callEnter.on('stream', (streamRemote) =>{
        this.addVideoUser(streamRemote)
      })
    }, err =>{
      console.log('error peer', err);
    })
  }
  initSocket(){
    this.webSocket.cbEvent.subscribe( res =>{
      if (res.name === 'new-user') {
        const idPeer = res.data
        // console.log(idPeer);
        this.sendcall(idPeer, this.currentStream)
      }
      console.log('Sokect', res);
    })
  }
  checkMediaDevices(){
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia(  {
        audio:false,
        video:true
      }).then( stream =>{
        this.currentStream = stream // stream igualado
        this.addVideoUser(stream)
      }).catch( () =>{
        console.log('Error no permission authorized.');
      })
    }else{
      console.log('Error: No media devices');
    }
  }
  addVideoUser(stream:any){
  this.listUser.push(stream)
  }
  sendcall(idPeer, stream){
    const newUserCall = this.peerService.peer.call(idPeer, stream)
    if (!newUserCall) {
      newUserCall.on('stream', ( userStream:MediaStream) =>{
        this.addVideoUser(userStream)
      })
    }
  }

}

