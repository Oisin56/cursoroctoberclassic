'use client';

import { Trophy, MapPin, Palette, Users, Flag } from 'lucide-react';
import Image from 'next/image';

export function PlayerBios() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-secondary rounded-lg p-6 border border-border">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">The Competitors</h2>
            <p className="text-muted-foreground">
              Meet the warriors of The October Classic 2025
            </p>
          </div>
        </div>
      </div>

      {/* Neil Hyland */}
      <div className="bg-secondary rounded-lg overflow-hidden border border-border">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Photo */}
          <div className="md:col-span-1 bg-gradient-to-br from-blue-500/10 to-primary/10 flex items-center justify-center p-8">
            <div className="relative w-full aspect-square max-w-[300px] rounded-lg overflow-hidden border-4 border-primary/20">
              <Image
                src="/images/neil.jpg"
                alt="Neil Hyland"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold text-primary">Neil Hyland</h3>
                <p className="text-xl text-muted-foreground italic">The Reigning Champion from Salthill</p>
              </div>
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-background/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Handicap</p>
                <p className="text-lg font-bold">11.0</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Home Club
                </p>
                <p className="text-lg font-bold">Bearna GC</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Palette className="h-3 w-3" /> Favourite Colour
                </p>
                <p className="text-lg font-bold text-blue-500">Blue</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Favourite Animal</p>
                <p className="text-lg font-bold">Human</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Flag className="h-3 w-3" /> Favourite Golfers
                </p>
                <p className="text-lg font-bold">Max Homa & Viktor Hovland</p>
              </div>
            </div>

            {/* Bio Text */}
            <div className="prose prose-sm max-w-none text-foreground">
              <p>
                Hailing from the salty breeze of Salthill, <strong>Dr. Neil Hyland</strong> is a Public Health Physician by day and a golfing powerhouse by weekend. Representing Bearna Golf Club off a tidy 11 handicap, Neil stormed to victory in Strandhill last year, claiming the inaugural Perpetual October Classic Cap in commanding fashion.
              </p>
              <p>
                Known for his explosive swing speed — a gift, no doubt, from years of hurling — Neil&apos;s game off the tee is his greatest weapon. His new driver setup will be put to the test this October, and while his approach play (as confirmed by DataGolf) still keeps him humble, he&apos;s more than capable of draining clutch putts when the pressure&apos;s on.
              </p>
              <p>
                With his favourite colour blue, his favourite animal human, and his golfing idols Max Homa and Viktor Hovland, Neil returns with one clear ambition: <strong>to retain the title and keep the Cap where it belongs — in Galway.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Oisín O'Carroll */}
      <div className="bg-secondary rounded-lg overflow-hidden border border-border">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Photo */}
          <div className="md:col-span-1 bg-gradient-to-br from-green-500/10 to-primary/10 flex items-center justify-center p-8">
            <div className="relative w-full aspect-square max-w-[300px] rounded-lg overflow-hidden border-4 border-primary/20">
              <Image
                src="/images/oisin.jpg"
                alt="Oisín O'Carroll"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold text-primary">Oisín O&apos;Carroll</h3>
                <p className="text-xl text-muted-foreground italic">The Birr Bomber on a Mission</p>
              </div>
              <Trophy className="h-10 w-10 text-gray-400" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-background/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Handicap</p>
                <p className="text-lg font-bold">11.2</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Home Club
                </p>
                <p className="text-lg font-bold">Birr GC</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Palette className="h-3 w-3" /> Favourite Colour
                </p>
                <p className="text-lg font-bold text-blue-500">Blue</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Favourite Animal</p>
                <p className="text-lg font-bold">Pig 🐷</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Flag className="h-3 w-3" /> Favourite Golfer
                </p>
                <p className="text-lg font-bold">Tommy Fleetwood</p>
              </div>
            </div>

            {/* Bio Text */}
            <div className="prose prose-sm max-w-none text-foreground">
              <p>
                From the heart of the Midlands, <strong>Dr. Oisín O&apos;Carroll</strong> of Birr, Co. Offaly, is the local GP who prescribes birdies and occasional bogeys in equal measure. Playing out of Birr Golf Club with an 11.2 handicap, Oisín is determined to right the wrongs of last year&apos;s showing and bring the October Classic Cap back home.
              </p>
              <p>
                A former hurler, his athletic roots lend him plenty of power off the tee — when the driver behaves. His Achilles&apos; heel, however, has often been the short game, where, in his own words, &quot;the giblets can get spilled.&quot;
              </p>
              <p>
                Inspired by Tommy Fleetwood and fuelled by a new swing and renewed confidence, Oisín arrives with his favourite colour (blue, naturally), his favourite animal (the noble pig), and one burning goal: <strong>to knock Hyland off his perch and restore glory to Birr.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

