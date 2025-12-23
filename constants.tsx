
import React from 'react';
import { 
  Square, 
  Hash, 
  Asterisk, 
  Minus, 
  Plus, 
  Circle, 
  AtSign, 
  Type, 
  Dot,
  DollarSign
} from 'lucide-react';

export const GRID_RANGE = Array.from({ length: 17 }, (_, i) => i + 4); // 4 to 20

export const CHARACTER_OPTIONS = [
  { char: ' ', label: 'Space', icon: <Square className="w-4 h-4 opacity-30" /> },
  { char: '*', label: 'Asterisk', icon: <Asterisk className="w-4 h-4" /> },
  { char: '_', label: 'Underscore', icon: <Minus className="w-4 h-4" /> },
  { char: '-', label: 'Dash', icon: <Minus className="w-4 h-4" /> },
  { char: '$', label: 'Dollar', icon: <DollarSign className="w-4 h-4" /> },
  { char: '#', label: 'Hash', icon: <Hash className="w-4 h-4" /> },
  { char: '@', label: 'At', icon: <AtSign className="w-4 h-4" /> },
  { char: '+', label: 'Plus', icon: <Plus className="w-4 h-4" /> },
  { char: '.', label: 'Dot', icon: <Dot className="w-4 h-4" /> },
];

export const INITIAL_CHARS = [' '];

export const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
export const NUMBERS = "123456789".split("");
