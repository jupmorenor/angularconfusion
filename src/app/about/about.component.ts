import { Component, OnInit, Inject } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    flyInOut(),
    expand(),
  ],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  leadersError: string;

  constructor(
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL: string,
  ) { }

  ngOnInit(): void {
    this.leaderService.getLeaders().subscribe(leaders => this.leaders = leaders, err => this.leadersError = <any>err);
  }

}
