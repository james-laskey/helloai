export const LANGUAGE_TOPICS = {
  'Spanish': {
    icon: '🇪🇸',
    color: '#c60b1e',
    topics: [
      { 
        id: 'sp_pronouns', 
        name: 'Subject Pronouns & Ser', 
        concept: 'Grammar',
        description: 'Learn yo/tú/él/ella/usted/nosotros/ellos and the verb "to be" (ser) for permanent characteristics',
        example: 'Yo soy estudiante. → I am a student.'
      },
      { 
        id: 'sp_ar_verbs', 
        name: 'Regular -AR Verbs (Present)', 
        concept: 'Grammar',
        description: 'Conjugate hablar, cantar, bailar in present tense',
        example: 'Yo hablo español. Tú hablas inglés.'
      },
      { 
        id: 'sp_estar', 
        name: 'Estar & Locations', 
        concept: 'Grammar',
        description: 'The other "to be" for temporary states, locations, and emotions',
        example: 'Estoy cansado. → I am tired. El libro está en la mesa.'
      },
      { 
        id: 'sp_ser_vs_estar', 
        name: 'Ser vs Estar Mastery', 
        concept: 'Grammar',
        description: 'Permanent vs temporary - DOCTOR (Description, Occupation, Characteristic, Time, Origin, Relationship) vs PLACE (Position, Location, Action, Condition, Emotion)',
        example: 'Soy feliz (I am happy by nature) vs Estoy feliz (I am happy right now)'
      },
      { 
        id: 'sp_gender', 
        name: 'Noun Gender & Articles', 
        concept: 'Grammar',
        description: 'Masculine (el, un) vs feminine (la, una) nouns and exceptions',
        example: 'El problema, la mano, el día'
      },
      { 
        id: 'sp_ir_er_verbs', 
        name: 'Regular -ER & -IR Verbs', 
        concept: 'Grammar',
        description: 'Conjugate comer, beber, vivir, escribir',
        example: 'Ella come frutas. Nosotros vivimos en Madrid.'
      },
      { 
        id: 'sp_stem_changes', 
        name: 'Stem-Changing Verbs', 
        concept: 'Grammar',
        description: 'e→ie, o→ue, e→i patterns (pensar, poder, pedir)',
        example: 'Yo pienso, tú piensas, él piensa, nosotros pensamos'
      },
      { 
        id: 'sp_preterite', 
        name: 'Preterite Tense (Past)', 
        concept: 'Grammar',
        description: 'Completed past actions - regular and irregular conjugations',
        example: 'Ayer comí pizza. → Yesterday I ate pizza.'
      },
      { 
        id: 'sp_imperfect', 
        name: 'Imperfect Tense', 
        concept: 'Grammar',
        description: 'Past habits, ongoing actions, descriptions in the past',
        example: 'Cuando era niño, jugaba fútbol. → When I was a child, I used to play soccer.'
      },
      { 
        id: 'sp_pret_vs_imp', 
        name: 'Preterite vs Imperfect', 
        concept: 'Grammar',
        description: 'Completed actions vs ongoing/habitual past actions',
        example: 'Llovía (was raining) cuando llegamos (arrived)'
      },
      { 
        id: 'sp_commands', 
        name: 'Commands & Imperative', 
        concept: 'Grammar',
        description: 'Tú, usted, ustedes commands - affirmative and negative',
        example: '¡Habla! ¡No hables! ¡Coma! ¡Vengan!'
      },
      { 
        id: 'sp_subjunctive', 
        name: 'Present Subjunctive', 
        concept: 'Grammar',
        description: 'Emotions, doubts, wishes, impersonal expressions',
        example: 'Espero que tengas un buen día. → I hope you have a good day.'
      },
      { 
        id: 'sp_future', 
        name: 'Future & Conditional', 
        concept: 'Grammar',
        description: 'Simple future (ir a + infinitive) and conditional tense (would)',
        example: 'Mañana estudiaré. → Tomorrow I will study. Me gustaría viajar. → I would like to travel.'
      }
    ]
  },
  
  'French': {
    icon: '🇫🇷',
    color: '#0055a4',
    topics: [
      { 
        id: 'fr_pronouns', 
        name: 'Subject Pronouns & Être', 
        concept: 'Grammar',
        description: 'Je/tu/il/elle/nous/vous/ils/elles and the verb "to be" (être)',
        example: 'Je suis français. Tu es fatigué.'
      },
      { 
        id: 'fr_avoir', 
        name: 'Avoir & Expressions', 
        concept: 'Grammar',
        description: 'The verb "to have" (avoir) and common expressions (age, hunger, thirst)',
        example: 'J\'ai 25 ans. J\'ai faim. → I am 25. I am hungry.'
      },
      { 
        id: 'fr_er_verbs', 
        name: 'Regular -ER Verbs', 
        concept: 'Grammar',
        description: 'Conjugate parler, aimer, regarder in present tense',
        example: 'Je parle, tu parles, il/elle parle, nous parlons, vous parlez, ils/elles parlent'
      },
      { 
        id: 'fr_negation', 
        name: 'Negation (ne...pas)', 
        concept: 'Grammar',
        description: 'Forming negative sentences with ne...pas around the verb',
        example: 'Je ne mange pas. → I don\'t eat. Il n\'aime pas le café.'
      },
      { 
        id: 'fr_articles', 
        name: 'Definite & Indefinite Articles', 
        concept: 'Grammar',
        description: 'Le/la/les (the) and un/une/des (a/some) with contractions',
        example: 'Le livre, la maison, l\'école, des amis, du café (de + le)'
      },
      { 
        id: 'fr_adjectives', 
        name: 'Adjective Agreement', 
        concept: 'Grammar',
        description: 'Gender and number agreement - most adjectives come AFTER the noun',
        example: 'Un grand garçon, une grande fille, des grands garçons'
      },
      { 
        id: 'fr_passe_compose', 
        name: 'Passé Composé (Past)', 
        concept: 'Grammar',
        description: 'Past tense with avoir/être + past participle',
        example: 'J\'ai mangé. → I ate. Elle est allée. → She went.'
      },
      { 
        id: 'fr_imparfait', 
        name: 'Imparfait', 
        concept: 'Grammar',
        description: 'Past habitual actions, descriptions, ongoing actions',
        example: 'Quand j\'étais petit, je jouais au parc. → When I was little, I used to play at the park.'
      },
      { 
        id: 'fr_futur', 
        name: 'Futur Simple', 
        concept: 'Grammar',
        description: 'Simple future tense (will) and near future (aller + infinitive)',
        example: 'Je voyagerai demain. → I will travel tomorrow. Je vais manger. → I\'m going to eat.'
      },
      { 
        id: 'fr_pronoms_obj', 
        name: 'Object Pronouns', 
        concept: 'Grammar',
        description: 'Direct (le/la/les) and indirect (lui/leur) object pronouns',
        example: 'Je le vois. → I see him. Je lui parle. → I talk to him.'
      },
      { 
        id: 'fr_conditionnel', 
        name: 'Conditional & Politeness', 
        concept: 'Grammar',
        description: 'Would/could/should and polite requests',
        example: 'Je voudrais un café. → I would like coffee. Pourriez-vous m\'aider?'
      },
      { 
        id: 'fr_subjonctif', 
        name: 'Subjunctive Mood', 
        concept: 'Grammar',
        description: 'Expressions of necessity, emotion, doubt',
        example: 'Il faut que tu viennes. → You must come. Je regrette qu\'il parte.'
      }
    ]
  },
  
  'Japanese': {
    icon: '🇯🇵',
    color: '#bc002d',
    topics: [
      { 
        id: 'jp_hiragana', 
        name: 'Hiragana Basics', 
        concept: 'Writing',
        description: '46 basic characters for native Japanese words',
        example: 'あ(a), い(i), う(u), え(e), お(o), か(ka), き(ki), く(ku)'
      },
      { 
        id: 'jp_katakana', 
        name: 'Katakana Basics', 
        concept: 'Writing',
        description: '46 characters for foreign words, loanwords, onomatopoeia',
        example: 'コーヒー (kōhī - coffee), テレビ (terebi - TV)'
      },
      { 
        id: 'jp_particles', 
        name: 'Basic Particles (は, が, を, に)', 
        concept: 'Grammar',
        description: 'Topic marker (wa), subject marker (ga), direct object (wo), location/time (ni)',
        example: '私はコーヒーを飲みます。 → I drink coffee.'
      },
      { 
        id: 'jp_present_tense', 
        name: 'Present/Future Tense', 
        concept: 'Grammar',
        description: 'Verb conjugation for non-past actions (る-verbs, う-verbs, irregular)',
        example: '食べる (taberu - eat), 飲む (nomu - drink), する (suru - do)'
      },
      { 
        id: 'jp_past_tense', 
        name: 'Past Tense', 
        concept: 'Grammar',
        description: 'Polite (ました/ましたか) and plain (た-form) past conjugations',
        example: '食べました (tabemashita - ate), 飲んだ (nonda - drank)'
      },
      { 
        id: 'jp_te_form', 
        name: 'Te-Form & Connections', 
        concept: 'Grammar',
        description: 'Connecting verbs, making requests, expressing ongoing actions',
        example: '食べて (tabete - please eat), 飲んでいます (nondeimasu - is drinking)'
      },
      { 
        id: 'jp_adjectives', 
        name: 'い & な Adjectives', 
        concept: 'Grammar',
        description: 'Two adjective types with different conjugation patterns',
        example: '暑い (atsui - hot), 静かな (shizukana - quiet)'
      },
      { 
        id: 'jp_polite_forms', 
        name: 'Polite vs Plain Speech', 
        concept: 'Grammar',
        description: 'Desu/masu form (polite) vs dictionary form (casual)',
        example: '行きます vs 行く (iku - go), です vs だ (da - is)'
      },
      { 
        id: 'jp_counters', 
        name: 'Counters & Numbers', 
        concept: 'Grammar',
        description: 'Different counting systems for objects, people, time, flat items',
        example: '一人 (hitori - one person), 一枚 (ichimai - one flat object), 一匹 (ippiki - one small animal)'
      },
      { 
        id: 'jp_te_imasu', 
        name: 'Te-Imasu Forms', 
        concept: 'Grammar',
        description: 'Ongoing actions, current states, habitual actions',
        example: '雨が降っています (Ame ga futteimasu - It\'s raining), 結婚しています (Kekkon shiteimasu - I am married)'
      }
    ]
  },
  
  'Korean': {
    icon: '🇰🇷',
    color: '#cd2e3a',
    topics: [
      { 
        id: 'ko_hangul', 
        name: 'Hangul Reading & Writing', 
        concept: 'Writing',
        description: '24 letters (14 consonants, 10 vowels) + 16 compound letters',
        example: 'ㄱ(g), ㄴ(n), ㅏ(a), ㅓ(eo), 가(ga), 나(na)'
      },
      { 
        id: 'ko_sentence_structure', 
        name: 'SOV Sentence Structure', 
        concept: 'Grammar',
        description: 'Subject-Object-Verb order with topic/subject markers',
        example: '나는 사과를 먹어요 (I apple eat) → I eat an apple.'
      },
      { 
        id: 'ko_particles', 
        name: 'Particles (은/는, 이/가, 을/를)', 
        concept: 'Grammar',
        description: 'Topic, subject, and object markers in Korean',
        example: '저는 (as for me), 날씨가 (weather), 물을 (water - object)'
      },
      { 
        id: 'ko_present_tense', 
        name: 'Present Tense (아요/어요)', 
        concept: 'Grammar',
        description: 'Polite present tense conjugations for verbs and adjectives',
        example: '가다→가요 (go), 먹다→먹어요 (eat), 예쁘다→예뻐요 (pretty)'
      },
      { 
        id: 'ko_past_tense', 
        name: 'Past Tense (았어요/었어요)', 
        concept: 'Grammar',
        description: 'Polite past tense conjugations',
        example: '가다→갔어요 (went), 먹다→먹었어요 (ate), 하다→했어요 (did)'
      },
      { 
        id: 'ko_honorifics', 
        name: 'Honorifics (시/께서)', 
        concept: 'Grammar',
        description: 'Showing respect with honorific verb endings and special nouns',
        example: '가다→가세요 (go - honorific), 밥→진지 (meal - honorific), 나이→연세 (age)'
      },
      { 
        id: 'ko_future_tense', 
        name: 'Future Tense (ㄹ/을 거예요)', 
        concept: 'Grammar',
        description: 'Expressing future intentions and predictions',
        example: '갈 거예요 (will go), 먹을 거예요 (will eat)'
      },
      { 
        id: 'ko_adjectives', 
        name: 'Descriptive Verbs', 
        concept: 'Grammar',
        description: 'Korean adjectives function as verbs and conjugate',
        example: '크다 (to be big), 작다 (to be small), 맛있다 (to be delicious)'
      },
      { 
        id: 'ko_negation', 
        name: 'Negation (안, 지 않다, 못)', 
        concept: 'Grammar',
        description: 'Negative forms with 안 (short) and 지 않다 (long), plus 못 for inability',
        example: '안 가요 (don\'t go), 가지 않아요 (don\'t go), 못 가요 (can\'t go)'
      },
      { 
        id: 'ko_connective', 
        name: 'Connective Endings', 
        concept: 'Grammar',
        description: '아서/어서 (so, because), 고 (and), 지만 (but)',
        example: '피곤해서 자요 (Tired so sleep), 가고 먹어요 (go and eat)'
      }
    ]
  },
  
  'German': {
    icon: '🇩🇪',
    color: '#000000',
    topics: [
      { 
        id: 'de_cases', 
        name: 'Nominative & Accusative', 
        concept: 'Grammar',
        description: 'Subject case (der/die/das) and direct object case (den/die/das)',
        example: 'Der Hund beißt den Mann. (The dog bites the man)'
      },
      { 
        id: 'de_pronouns', 
        name: 'Personal Pronouns', 
        concept: 'Grammar',
        description: 'ich, du, er, sie, es, wir, ihr, sie, Sie',
        example: 'Ich sehe dich. Du hilfst mir.'
      },
      { 
        id: 'de_verb_position', 
        name: 'Verb Position Rules', 
        concept: 'Grammar',
        description: 'Verb-second in main clauses, verb-final in subordinate clauses',
        example: 'Ich trinke Wasser, weil ich durstig bin. (I drink water because I am thirsty)'
      },
      { 
        id: 'de_separable', 
        name: 'Separable Prefix Verbs', 
        concept: 'Grammar',
        description: 'Prefixes that detach and go to the end of the clause',
        example: 'Ich stehe um 7 Uhr auf. (I get up at 7) → aufstehen'
      },
      { 
        id: 'de_dative', 
        name: 'Dative Case', 
        concept: 'Grammar',
        description: 'Indirect object case (dem/der/dem/den)',
        example: 'Ich gebe dem Mann das Buch. (I give the man the book)'
      },
      { 
        id: 'de_prepositions', 
        name: 'Two-Way Prepositions', 
        concept: 'Grammar',
        description: 'In, an, auf, unter, über, vor, hinter, neben, zwischen (accusative for movement, dative for location)',
        example: 'Ich gehe in den Park (into) vs Ich bin im Park (inside)'
      },
      { 
        id: 'de_modal_verbs', 
        name: 'Modal Verbs', 
        concept: 'Grammar',
        description: 'können (can), müssen (must), dürfen (may), wollen (want), sollen (should), mögen (like)',
        example: 'Ich kann schwimmen. Du musst lernen.'
      },
      { 
        id: 'de_perfect', 
        name: 'Perfekt (Present Perfect)', 
        concept: 'Grammar',
        description: 'Past tense with haben/sein + past participle (ge- prefix)',
        example: 'Ich habe gegessen. (I ate), Sie ist gegangen. (She went)'
      },
      { 
        id: 'de_adjective_endings', 
        name: 'Adjective Declension', 
        concept: 'Grammar',
        description: 'Adjective endings based on gender, case, and article type',
        example: 'Ein großer Mann, der große Mann, mit großem Mann'
      },
      { 
        id: 'de_word_order', 
        name: 'Time-Manner-Place', 
        concept: 'Grammar',
        description: 'Standard word order: Time → Manner → Place',
        example: 'Ich fahre morgen mit dem Zug nach Berlin. (I go tomorrow by train to Berlin)'
      }
    ]
  },
  
  'Italian': {
    icon: '🇮🇹',
    color: '#009246',
    topics: [
      { 
        id: 'it_pronouns', 
        name: 'Subject Pronouns & Essere', 
        concept: 'Grammar',
        description: 'io, tu, lui/lei, Lei, noi, voi, loro and the verb "to be"',
        example: 'Io sono italiano. Tu sei stanco.'
      },
      { 
        id: 'it_avere', 
        name: 'Avere & Expressions', 
        concept: 'Grammar',
        description: 'The verb "to have" with age, hunger, thirst, cold, hot',
        example: 'Ho 30 anni. Ho fame. Ho freddo. → I am 30. I\'m hungry. I\'m cold.'
      },
      { 
        id: 'it_are_verbs', 
        name: 'Regular -ARE Verbs', 
        concept: 'Grammar',
        description: 'Conjugate parlare, mangiare, amare in present tense',
        example: 'Io parlo, tu parli, lui/lei parla, noi parliamo, voi parlate, loro parlano'
      },
      { 
        id: 'it_ere_ire', 
        name: '-ERE & -IRE Verbs', 
        concept: 'Grammar',
        description: 'Conjugate prendere, vedere, dormire, capire (with -isc-)',
        example: 'Io prendo, tu prendi, lui prende. Io capisco, tu capisci.'
      },
      { 
        id: 'it_articles', 
        name: 'Definite Articles & Contractions', 
        concept: 'Grammar',
        description: 'il, lo, la, l\', i, gli, le with prepositions a, da, di, in, su',
        example: 'al (a+il), del (di+il), sul (su+il), nel (in+il)'
      },
      { 
        id: 'it_passato', 
        name: 'Passato Prossimo (Past)', 
        concept: 'Grammar',
        description: 'Present tense of avere/essere + past participle',
        example: 'Ho mangiato (I ate), Sono andato (I went - masculine)'
      },
      { 
        id: 'it_imperfetto', 
        name: 'Imperfetto', 
        concept: 'Grammar',
        description: 'Past continuous and habitual actions (used to/was -ing)',
        example: 'Da bambino, giocavo al parco. (As a child, I used to play at the park)'
      },
      { 
        id: 'it_futuro', 
        name: 'Futuro Semplice', 
        concept: 'Grammar',
        description: 'Future tense (will) and its irregular forms',
        example: 'Domani viaggerò. (Tomorrow I will travel), Andrò, farò, potrò'
      },
      { 
        id: 'it_pronouns_obj', 
        name: 'Direct & Indirect Pronouns', 
        concept: 'Grammar',
        description: 'mi, ti, lo/la, ci, vi, li/le (direct) and mi, ti, gli/le, ci, vi, gli (indirect)',
        example: 'Lo vedo (I see him), Gli parlo (I talk to him)'
      },
      { 
        id: 'it_conditional', 
        name: 'Condizionale (Would/Could)', 
        concept: 'Grammar',
        description: 'Polite requests and hypothetical situations',
        example: 'Vorrei un caffè. (I would like coffee), Potresti aiutarmi? (Could you help me?)'
      }
    ]
  },
  
  'English': {
    icon: '🇬🇧',
    color: '#00247d',
    topics: [
      { 
        id: 'en_pronouns', 
        name: 'Subject & Object Pronouns', 
        concept: 'Grammar',
        description: 'I/you/he/she/it/we/they (subject) and me/you/him/her/it/us/them (object)',
        example: 'She loves him. They gave us the book.'
      },
      { 
        id: 'en_present_simple', 
        name: 'Present Simple Tense', 
        concept: 'Grammar',
        description: 'Habits, routines, general truths - add -s/-es for he/she/it',
        example: 'I work. She works. Do you like coffee? He doesn\'t smoke.'
      },
      { 
        id: 'en_present_continuous', 
        name: 'Present Continuous', 
        concept: 'Grammar',
        description: 'Actions happening now or around now (am/is/are + -ing)',
        example: 'I am reading. She is cooking dinner. They are studying.'
      },
      { 
        id: 'en_past_simple', 
        name: 'Past Simple Tense', 
        concept: 'Grammar',
        description: 'Completed past actions - regular (-ed) and irregular verbs',
        example: 'I walked to work. She ate breakfast. Did you see the movie?'
      },
      { 
        id: 'en_past_continuous', 
        name: 'Past Continuous', 
        concept: 'Grammar',
        description: 'Actions in progress at a specific past time (was/were + -ing)',
        example: 'I was sleeping when you called. They were watching TV at 8 PM.'
      },
      { 
        id: 'en_present_perfect', 
        name: 'Present Perfect', 
        concept: 'Grammar',
        description: 'Life experiences, past actions with present relevance, unfinished time periods',
        example: 'I have visited Paris. She has never tried sushi. Have you eaten yet?'
      },
      { 
        id: 'en_future', 
        name: 'Future Forms', 
        concept: 'Grammar',
        description: 'Will (predictions/decisions), Going to (plans), Present Continuous (arrangements)',
        example: 'It will rain tomorrow. I\'m going to study law. We\'re meeting at 7 PM.'
      },
      { 
        id: 'en_modals', 
        name: 'Modal Verbs', 
        concept: 'Grammar',
        description: 'Can/could (ability/permission), May/might (possibility), Must/have to (obligation), Should (advice)',
        example: 'You must wear a seatbelt. She can speak three languages. We should leave now.'
      },
      { 
        id: 'en_conditionals', 
        name: 'Conditionals (If Clauses)', 
        concept: 'Grammar',
        description: 'Zero (facts), First (real possibilities), Second (unreal present), Third (past hypotheticals)',
        example: 'If you heat water, it boils. If it rains, we will stay home. If I were rich, I would travel.'
      },
      { 
        id: 'en_passive', 
        name: 'Passive Voice', 
        concept: 'Grammar',
        description: 'Focus on the action rather than who did it (be + past participle)',
        example: 'The book was written by Hemingway. The car is being repaired.'
      },
      { 
        id: 'en_reported', 
        name: 'Reported Speech', 
        concept: 'Grammar',
        description: 'Backshifting tenses when reporting what someone said',
        example: 'She said she was tired. (Direct: "I am tired") He told me he would call. (Direct: "I will call")'
      }
    ]
  },
  
  'Chinese': {
    icon: '🇨🇳',
    color: '#de2910',
    topics: [
      { 
        id: 'zh_tones', 
        name: 'The 4 Tones + Neutral', 
        concept: 'Phonetics',
        description: 'First (high level), second (rising), third (falling-rising), fourth (falling)',
        example: 'mā (mother), má (hemp), mǎ (horse), mà (scold), ma (question particle)'
      },
      { 
        id: 'zh_pinyin', 
        name: 'Pinyin & Initials/Finals', 
        concept: 'Phonetics',
        description: 'Romanization system with 21 initials and 38 finals',
        example: 'b, p, m, f, d, t, n, l, g, k, h, j, q, x, zh, ch, sh, r, z, c, s'
      },
      { 
        id: 'zh_pronouns', 
        name: 'Personal Pronouns', 
        concept: 'Grammar',
        description: '我 (wǒ - I), 你 (nǐ - you), 他/她/它 (tā - he/she/it), 我们/你们/他们 (plural)',
        example: '我爱你 (Wǒ ài nǐ) - I love you. 他是老师 (Tā shì lǎoshī) - He is a teacher.'
      },
      { 
        id: 'zh_measure_words', 
        name: 'Measure Words', 
        concept: 'Grammar',
        description: '个 (gè - general), 只 (zhī - animals), 本 (běn - books), 张 (zhāng - flat objects)',
        example: '一个人 (one person), 一只狗 (one dog), 一本书 (one book), 一张纸 (one piece of paper)'
      },
      { 
        id: 'zh_no_tenses', 
        name: 'No Verb Conjugation', 
        concept: 'Grammar',
        description: 'Verbs don\'t change for tense - use time words or aspect markers',
        example: '昨天我去 (yesterday I go - past), 明天我去 (tomorrow I go - future)'
      },
      { 
        id: 'zh_le_particle', 
        name: '了 (le) Completion Marker', 
        concept: 'Grammar',
        description: 'Indicates completed action or change of state (perfective aspect)',
        example: '我吃了饭 (Wǒ chīle fàn - I ate), 下雨了 (Xiàyǔle - It\'s raining now)'
      },
      { 
        id: 'zh_question_forms', 
        name: 'Question Formation', 
        concept: 'Grammar',
        description: '吗 (ma - yes/no), 吗 (ma - tag questions), A-not-A pattern',
        example: '你好吗？ (How are you?), 你是不是学生？ (Are you a student?)'
      },
      { 
        id: 'zh_negation', 
        name: 'Negation (不 vs 没)', 
        concept: 'Grammar',
        description: '不 (bù - present/future, habitual), 没 (méi - past action, possession)',
        example: '我不吃 (I don\'t eat), 我没吃 (I didn\'t eat), 我没有钱 (I don\'t have money)'
      },
      { 
        id: 'zh_ba_construction', 
        name: '把 (bǎ) Disposal Structure', 
        concept: 'Grammar',
        description: 'Preposition that emphasizes the object being acted upon/affected',
        example: '请把门关上 (Please close the door), 我把书放在桌上 (I put the book on the table)'
      },
      { 
        id: 'zh_complements', 
        name: 'Result & Direction Complements', 
        concept: 'Grammar',
        description: 'Verbs + 完 (finish), 到 (arrive), 见 (see), 起 (up), 来/去 (come/go)',
        example: '吃完 (eat up), 看见 (see - look + see), 起来 (get up), 回来 (come back)'
      }
    ]
  }
};