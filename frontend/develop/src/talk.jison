/*
 * HyperTalk inspired talk script parser for JavaScript using jison
 */

// statement delimiter is end of line for this script. (not semicolon)
%token EOL

// reserved keywords
%token ON FUNCTION END PASS RETURN REPEAT NEXT IF THEN ELSE DO SEND GLOBAL

// constants
%token TRUE FALSE UP DOWN EMPTY QUOTE RETURN SPACE TAB COLON COMMA PI

// commands
//   navigation commands
%token GO PUSH POP HELP OPEN CLOSE LOCK_RECENT UNLOCK_RECENT ANSWER_PROGRAM ARROW_KEY
//   action commands
%token PUT GET DELETE SELECT DIAL CHOOSE CLICK DRAG TYPE
//   sound commands
%token BEEP PLAY PLAY_STOP SPEAK STOP_SOUND STOP_SPEECH DEBUG_SOUND
//   arithmatic commands
%token ADD SUBTRACT MULTIPLY DIVIDE CONVERT
//   search commands
%token FIND FIND_WHOLE FIND_WORD FIND_CHARS FIND_STRING SORT_CARDS SORT_ITEMS SORT_LINES
%token MARK MARK_CARDS_WHERE MARK_CARDS_BY_FINDING MARK_ALL_CARDS UNMARK UNMARK_CARDS_WHERE
%token UNMARK_CARDS_BY_FINDING UNMARK_ALL_CARDS GO_MARKED_CARD
//   display manipulation commands
%token VISUAL FLASH ANSWER ASK ASK_PASSWORD LOCK_SCREEN UNLOCK_SCREEN PALETTE PICTURE
//   object manipulation commands
%token HIDE SHOW SHOW_CARDS HIDE_GROUPS SHOW_GROUPS GET SET EDIT_SCRIPT RESET_PAINT
%token SELECT SELECT_EMPTY SELECT_LINE CREATE_STACK SAVE COPY_TEMPLATE ENTER_IN_FIELD
//   file manipulation commands
%token OPEN_FILE CLOSE_FILE ANSWER_FILE ASK_FILE READ WRITE PRINT IMPORT_PAINT EXPORT_PAINT
//   menu commands
%token DO_MENU CREATE_MENU PUT DELETE RESET_MENUBAR ENABLE DISABLE
//   printing commands
%token PRINT RESET_PRINTING OPEN_PRINTING PRINT_CARD CLOSE_PRINTING OPEN_REPORT_PRINTING
//   script commands
%token WAIT EXIT_TO_HYPERCARD LOCK_MESSAGES_CMD UNLOCK_MESSAGES_CMD LOCK_ERROR_DIALOGS_CMD
%token UNLOCK_ERROR_DIALOGS_CMD PASS SEND DO START_USING STOP_USING DEBUG_CHECKPOINT MAGIC
//   window manipulation commands
%token CLOSE_WINDOW
//   key manipulation commands
%token COMMAND_KEY_DOWN CONTROL_KEY ENTER_KEY RETURN_KEY TAB_KEY

// properties
//   global properties
%token BLIND_TYPING CURSOR DEBUGGER DIALING_TIME DIALING_VOLUME DRAG_SPEED EDIT_BKGND ENVIRONMENT
%token ID ITEMDELIMITER LANGUAGE LOCK_ERROR_DIALOGS LOCK_MESSAGES LOCK_RECENT LOCK_SCREEN
%token LONG_WINDOW_TITLES MESSAGE_WATCHER NAME NUMBER_FORMAT POWER_KEYS PRINT_MARGINS PRINT_TEXT_ALIGN
%token PRINT_TEXT_FONT PRINT_TEXT_HEIGHT PRINT_TEXT_SIZE PRINT_TEXT_STYLE SCRIPT_EDITOR SCRIPTING_LANGUAGE
%token SCRIPT_TEXT_FONT SCRIPT_TEXT_SIZE STACKS_IN_USE SUSPENDED TEXT_ARROWS TRACE_DELAY USER_LEVEL
%token USER_MODIFY VARIABLE_WATCHER SOUND_CHANNEL
//   menu properties
%token CHECK_MARK MARK_CHAR COMMAND_CHAR ENABLED MENU_MESSAGE NAME RECT TEXT_STYLE VISIBLE
//   window properties - will not implement
//   painting properties
%token BRUSH CENTERED FILLED GRID LINE_SIZE MULTIPLE MULTI_SPACE PATTERN POLY_SIDES 
%token TEXT_ALIGN TEXT_FONT TEXT_HEIGHT TEXT_SIZE TEXT_STYLE
//   stack, card, background properties
%token CANT_ABORT CANT_DELETE CANT_MODIFY CANT_PEEK FREE_SIZE SIZE ID MARKED NAME NUMBER OWNER
%token RECT REPORT_TEMPLATES SCRIPT SCRIPTING_LANGUAGE SHOW_PICT
//   field properties
%token AUTO_SELECT AUTO_TAB DONT_SEARCH DONT_WRAP FIXED_LINE_HEIGHT ID LEFT TOP RIGHT BOTTOM
%token TOP_LEFT BOTTOM_RIGHT WIDTH HEIGHT LOC LOCK_TEXT SHOW_LINES WIDE_MARGINS
%token MULTIPLE_LINES NAME NUMBER RECT SCROLL SCRIPT SCRIPTING_LANGUAGE SHARED_TEXT STYLE
%token TEXT_ALIGN TEXT_FONT TEXT_HEIGHT TEXT_SIZE TEXT_STYLE VISIBLE
//   button properties
%token AUTO_HILITE SHOW_NAME LEFT TOP RIGHT BOTTOM TOP_LEFT BOTTOM_RIGHT WIDTH HEIGHT
%token ENABLED FAMILY HILITE ICON ID LOC NAME NUMBER PART_NUMBER RECT SCRIPT SCRIPTING_LANGUAGE
%token SHARED_HILITE STYLE TEXT_ALIGN TEXT_FONT TEXT_HEIGHT TEXT_SIZE TEXT_STYLE TITLE_WIDTH VISIBLE

// objects
%token BACKGROUND BUTTON CARD FIELD PART STACK

// pointers
%token BACK FORTH ME NEXT PREV FIRST LAST THIS TARGET
%token SECOND THIRD FOURTH FIFTH SIXTH SEVENTH EIGHTH NINTH TENTH


// prepositions
%token AFTER ALL BEFORE IN INTO TO OF

// containers:
%token CLIPBOARD FIELD IT MENU MENU_ITEM MESSAGE_BOX SELECTION

// chunks
%token CHARACTER ITEM LINE WORD

// system messages
%token MOUSE_DOWN MOUSE_STILL_DOWN MOUSE_UP MOUSE_DOUBLE_CLICK MOUSE_ENTER MOUSE_WITHIN MOUSE_LEAVE
%token EXIT_FIELD KEY_DOWN COMMAND_KEY_DOWN RETURN_KEY ENTER_KEY TAB_KEY ENTER_IN_FIELD RETURN_IN_FIELD
%token ARROW_KEY CONTROL_KEY FUNCTION_KEY DO_MENU SUSPEND_STACK RESUME_STACK START_UP SUSPEND RESUME
%token QUIT APPLE_EVENT HELP CLOSE SIZE_WINDOW MOVE_WINDOW MOUSE_DOWN_IN_PICTURE MOUSE_UP_IN_PICTURE
%token OPEN_PICTURE OPEN_PALETTE CLOSE_PICTURE CLOSE_PALETTE CHOOSE CLOSE_CARD CLOSE_FIELD CLOSE_BACKGROUND
%token DELETE_BACKGROUND DELETE_BUTTON DELETE_CARD DELETE_FIELD DELETE_STACK IDLE NEW_BACKGROUND
%token NEW_BUTTON NEW_CARD NEW_FIELD NEW_STACK OPEN_BACKGROUND OPEN_CARD OPEN_FIELD OPEN_STACK

// builtin functions
//   Date and time
%token THE_DATE THE_TIME THE_SECONDS THE_TICKS
//   Keyboard and mouse
%token THE_MOUSE_H THE_MOUSE_V THE_MOUSE_LOC THE_COMMAND_KEY THE_OPTION_KEY THE_SHIFT_KEY THE_MOUSE
%token THE_MOUSE_CLICK THE_CLICK_H THE_CLICK_V THE_CLICK_LOC
//   Strings
%token THE_LENGTH_OF THE_CLICK_CHUNK THE_CLICK_LINE THE_CLICK_TEXT THE_SELECTED_TEXT
%token THE_SELECTED_CHUNK THE_SELECTED_LINE THE_SELECTED_LINE_OF THE_SELECTED_FIELD THE_SELECTED_LOC THE_FOUND_TEXT
%token THE_FOUND_CHUNK THE_FOUND_LINE THE_FOUND_FIELD THE_CHAR_TO_NUM_OF THE_NUM_TO_CHAR_OF THE_OFFSET_OF
//   Arith
%token THE_RANDOM_OF THE_SUM_OF THE_VALUE_OF THE_ABS_OF THE_ANNUITY_OF THE_ATAN_OF THE_AVERAGE_OF
%token THE_COMPOUND_OF THE_COS_OF THE_EXP_OF THE_EXP1_OF THE_EXP2_OF THE_LN_OF THE_LN1_OF THE_LN2_OF
%token THE_LOG2_OF THE_MAX_OF THE_MIN_OF THE_ROUND_OF THE_SIN_OF THE_SQRT_OF THE_TAN_OF THE_TRUNC_OF
//   System environment
%token THE_NUMBER_OF THE_NUMBER_OF_BACKGROUNDS THE_NUMBER_OF_CARDS THE_NUMBER_OF_CARDS_IN
%token THE_NUMBER_OF_MARKED_CARDS THE_NUMBER_OF_MENUS THE_NUMBER_OF_MENUITEMS_OF THE_NUMBER_OF_WINDOWS
%token THE_SOUND THE_SYSTEM_VERSION THE_TOOL THE_VERSION THE_LONG_VERSION THE_MENUS THE_SCREEN_RECT
%token THE_STACKS THE_WINDOWS THE_DISK_SPACE THE_HEAP_SPACE THE_STACK_SPACE THE_SELECTED_BUTTON_OF
%token THE_PROGRAMS THE_SPEECH THE_VOICES
//   Scripting
%token THE_RESULT THE_TARGET THE_DESTINATION THE_PARAM_OF THE_PARAM_COUNT THE_PARAMS

// identifier used for function names and variable names
%token IDENTIFIER DOUBLE_QUOTE SINGLE_QUOTE STRING_LITERAL
%token INTEGER_LITERAL NUMBER_LITERAL

/* operator associations and precedence */
%left LOWEST_PRIO
%left ','
%left OR
%left AND
%left IS IS_NOT EQUAL
%left LT GT LE GE IS_IN CONTAINS IS_NOT_IN IS_A IS_NOT_A IS_WITHIN IS_NOT_WITHIN
// fixed: not sure the specific of & and &&... and how about | and || too? -> && is text concatination (with space)
// %left '|' '||' // no such operator as this one.
//%left '&' '&&' named as below
%left OP_AMP OP_AMPAMP
%left '+' '-'
%left '*' '/' DIV MOD
%left '^'
%left UMINUS NOT THERE_IS_A THERE_IS_NOT_A THERE_IS_NO
%left LOWER_PREC
%left ID OF BUTTON FIELD CARD BACKGROUND STACK CARD_FIELD BACKGROUND_FIELD STACK_FIELD
%left HIGHER_PREC
%left HIGHEST_PRIO


/* lexical grammar */
%lex

%%

// multi-line comment // fixme: humm, does not work. maybe jison eats EOL and can't find other line's '*/' ?
"/*".*"*/" { /* skip multi-line comments */ }

//! todo: handle other utf8 space: \u00a0\u1680​\u180e\u2000​-\u200a​\u2028\u2029\u202f\u205f​\u3000\ufeff
[ \f\t\v​]+ { /* skip whitespace , except for end of line */ }

// single line comment // HyperTalk comment is '--' though...
[#].* { /* skip single line comments starting with '#' */ }
"//".* { /* skip single line comments starting with '//' */ }

// statement delimiter
(\r\n|[\r\n]) return 'EOL'

// forward declaration so not to match shorter ones
"divide" return 'DIVIDE'
"open"\s+"file" return 'OPEN_FILE'
"close"\s+"file" return 'CLOSE_FILE'
"answer"\s+"file" return 'ANSWER_FILE'
"ask"\s+"file" return 'ASK_FILE'
"open"\s+"printing" return 'OPEN_PRINTING'
"print"\s+"card" return 'PRINT_CARD'
"close"\s+"printing" return 'CLOSE_PRINTING'
"open"\s+"report"\s+"printing" return 'OPEN_REPORT_PRINTING'
"close"\s+"window" return 'CLOSE_WINDOW'
"go"\s+"marked"\s+"card" return 'GO_MARKED_CARD'
"select"\s+"empty" return 'SELECT_EMPTY'
"select"\s+"line" return 'SELECT_LINE'
"push"\s+"left" { yytext = '"push left"'; return 'PUSH_LEFT'; }
"push"\s+"right" { yytext = '"push right"'; return 'PUSH_RIGHT'; }
"push"\s+"up" { yytext = '"push up"'; return 'PUSH_UP'; }
"push"\s+"down" { yytext = '"push down"'; return 'PUSH_DOWN'; }
"with"\s+"dialog" return 'WITH_DIALOG'
"text"\s+"tool" { yytext = '"Text"'; return 'TEXT_TOOL'; }
// builtin functions. they all start with "the", but "the" global property bats, which could be removed?
"the"\s+"date" return 'THE_DATE'
"the"\s+"time" return 'THE_TIME'
"the"\s+("seconds"|"secs") return 'THE_SECONDS'
"the"\s+"ticks" return 'THE_TICKS'
"the"\s+"mouseH" return 'THE_MOUSE_H'
"the"\s+"mouseV" return 'THE_MOUSE_V'
"the"\s+"mouseLoc" return 'THE_MOUSE_LOC'
"the"\s+"commandKey" return 'THE_COMMAND_KEY'
"the"\s+"optionKey" return 'THE_OPTION_KEY'
"the"\s+"shiftKey" return 'THE_SHIFT_KEY'
"the"\s+"mouse" return 'THE_MOUSE'
"the"\s+"mouseClick" return 'THE_MOUSE_CLICK'
"the"\s+"clickH" return 'THE_CLICK_H'
"the"\s+"clickV" return 'THE_CLICK_V'
"the"\s+"clickLoc" return 'THE_CLICK_LOC'
"the"\s+"length"\s+"of" return 'THE_LENGTH_OF'
"the"\s+"clickChunk" return 'THE_CLICK_CHUNK'
"the"\s+"clickLine" return 'THE_CLICK_LINE'
"the"\s+"clickText" return 'THE_CLICK_TEXT'
"the"\s+"selectedText" return 'THE_SELECTED_TEXT'
"the"\s+"selectedChunk" return 'THE_SELECTED_CHUNK'
("the"\s+)?"selectedLine"("s")?\s+"of" return 'THE_SELECTED_LINE_OF'
"the"\s+"selectedLine"("s")? return 'THE_SELECTED_LINE'
"the"\s+"selectedField" return 'THE_SELECTED_FIELD'
"the"\s+"selectedLoc" return 'THE_SELECTED_LOC'
"the"\s+"foundText" return 'THE_FOUND_TEXT'
"the"\s+"foundChunk" return 'THE_FOUND_CHUNK'
"the"\s+"foundLine" return 'THE_FOUND_LINE'
"the"\s+"foundField" return 'THE_FOUND_FIELD'
// make "the" arbitrary in case of multiple (space separated) tokens
("the"\s+)?"charToNum"\s+"of" return 'THE_CHAR_TO_NUM_OF'
("the"\s+)?"numToChar"\s+"of" return 'THE_NUM_TO_CHAR_OF'
("the"\s+)?"offset"\s+"of" return 'THE_OFFSET_OF'
("the"\s+)?"random"\s+"of" return 'THE_RANDOM_OF'
("the"\s+)?"sum"\s+"of" return 'THE_SUM_OF'
("the"\s+)?"value"\s+"of" return 'THE_VALUE_OF'
("the"\s+)?"abs"\s+"of" return 'THE_ABS_OF'
("the"\s+)?"annuity"\s+"of" return 'THE_ANNUITY_OF'
("the"\s+)?"atan"\s+"of" return 'THE_ATAN_OF'
("the"\s+)?"average"\s+"of" return 'THE_AVERAGE_OF'
("the"\s+)?"compound"\s+"of" return 'THE_COMPOUND_OF'
("the"\s+)?"cos"\s+"of" return 'THE_COS_OF'
("the"\s+)?"exp1"\s+"of" return 'THE_EXP1_OF'
("the"\s+)?"exp2"\s+"of" return 'THE_EXP2_OF'
("the"\s+)?"exp"\s+"of" return 'THE_EXP_OF'
("the"\s+)?"ln1"\s+"of" return 'THE_LN1_OF'
("the"\s+)?"ln2"\s+"of" return 'THE_LN2_OF'
("the"\s+)?"ln"\s+"of" return 'THE_LN_OF'
("the"\s+)?"log2"\s+"of" return 'THE_LOG2_OF'
("the"\s+)?"max"\s+"of" return 'THE_MAX_OF'
("the"\s+)?"min"\s+"of" return 'THE_MIN_OF'
("the"\s+)?"round"\s+"of" return 'THE_ROUND_OF'
("the"\s+)?"sin"\s+"of" return 'THE_SIN_OF'
("the"\s+)?"sqrt"\s+"of" return 'THE_SQRT_OF'
("the"\s+)?"tan"\s+"of" return 'THE_TAN_OF'
("the"\s+)?"trunc"\s+"of" return 'THE_TRUNC_OF'
// expand "number of <objects>"
("the"\s+)?"number"\s+"of"\s+("buttons"|"btns")\s+"in" return 'THE_NUMBER_OF_BUTTONS_IN'
("the"\s+)?"number"\s+"of"\s+("fields"|"flds")\s+"in" return 'THE_NUMBER_OF_FIELDS_IN'
("the"\s+)?"number"\s+"of"\s+("buttons"|"btns") return 'THE_NUMBER_OF_BUTTONS'
("the"\s+)?"number"\s+"of"\s+("fields"|"flds") return 'THE_NUMBER_OF_FIELDS'
// expand "number of <chunks> in" container
("the"\s+)?"number"\s+"of"\s+("characters"|"chars")\s+"in" return 'THE_NUMBER_OF_CHARS_IN'
("the"\s+)?"number"\s+"of"\s+"items"\s+"in" return 'THE_NUMBER_OF_ITEMS_IN'
("the"\s+)?"number"\s+"of"\s+"lines"\s+"in" return 'THE_NUMBER_OF_LINES_IN'
("the"\s+)?"number"\s+"of"\s+"words"\s+"in" return 'THE_NUMBER_OF_WORDS_IN'
("the"\s+)?"number"\s+"of"\s+("backgrounds"|"bkgnds"|"bgs")(\s+"in"\s+"this"\s+"stack")? return 'THE_NUMBER_OF_BACKGROUNDS'
("the"\s+)?"number"\s+"of"\s+("cards"|"cds")\s+"in" return 'THE_NUMBER_OF_CARDS_IN'
("the"\s+)?"number"\s+"of"\s+("cards"|"cds")(\s+"in"\s+"this"\s+"stack")? return 'THE_NUMBER_OF_CARDS'
("the"\s+)?"number"\s+"of"\s+"marked"\s+("cards"|"cds") return 'THE_NUMBER_OF_MARKED_CARDS'
("the"\s+)?"number"\s+"of"\s+"menuItems"\s+"of" return 'THE_NUMBER_OF_MENUITEMS_OF'
("the"\s+)?"number"\s+"of"\s+"menus" return 'THE_NUMBER_OF_MENUS'
("the"\s+)?"number"\s+"of"\s+"windows" return 'THE_NUMBER_OF_WINDOWS'
//("the"\s+)?"number"\s+"of" return 'THE_NUMBER_OF'
"the"\s+"sound" return 'THE_SOUND'
"the"\s+"systemVersion" return 'THE_SYSTEM_VERSION'
"the"\s+"tool" return 'THE_TOOL'
"the"\s+"version"\s+"of" return 'THE_VERSION_OF'
"the"\s+"long"\s+"version"\s+"of" return 'THE_LONG_VERSION_OF'
"the"\s+"version" return 'THE_VERSION'
"the"\s+"long"\s+"version" return 'THE_LONG_VERSION'
"the"\s+"menus" return 'THE_MENUS'
"the"\s+"screenRect" return 'THE_SCREEN_RECT'
"the"\s+"stacks" return 'THE_STACKS'
"the"\s+"windows" return 'THE_WINDOWS'
"the"\s+"diskSpace" return 'THE_DISK_SPACE'
"the"\s+"heapSpace" return 'THE_HEAP_SPACE'
"the"\s+"stackSpace" return 'THE_STACK_SPACE'
("the"\s+)?"selectedButton"\s+"of"\s+("background"|"bkgnd"|"bg")\s+"family" return 'THE_SELECTED_BUTTON_OF_BACKGROUND_FAMILY'
("the"\s+)?"selectedButton"\s+"of"(\s+("card"|"cd"))?\s+"family" return 'THE_SELECTED_BUTTON_OF_CARD_FAMILY'
"the"\s+"programs" return 'THE_PROGRAMS'
"the"\s+"speech" return 'THE_SPEECH'
"the"\s+"voices" return 'THE_VOICES'
"the"\s+"result" return 'THE_RESULT'
"the"\s+"target" return 'THE_TARGET'
"the"\s+"destination" return 'THE_DESTINATION'
("the"\s+)?"param"\s+"of" return 'THE_PARAM_OF'
"the"\s+"paramCount" return 'THE_PARAM_COUNT'
"the"\s+"params" return 'THE_PARAMS'
("the"\s+)?"first" { yytext = '"first"'; return 'FIRST'; }
("the"\s+)?"second" { yytext = '"second"'; return 'SECOND'; }
("the"\s+)?"third" { yytext = '"third"'; return 'THIRD'; }
("the"\s+)?"fourth" { yytext = '"fourth"'; return 'FOURTH'; }
("the"\s+)?"fifth" { yytext = '"fifth"'; return 'FIFTH'; }
("the"\s+)?"sixth" { yytext = '"sixth"'; return 'SIXTH'; }
("the"\s+)?"seventh" { yytext = '"seventh"'; return 'SEVENTH'; }
("the"\s+)?"eighth" { yytext = '"eighth"'; return 'EIGHTH'; }
("the"\s+)?"ninth" { yytext = '"ninth"'; return 'NINTH'; }
("the"\s+)?"tenth" { yytext = '"tenth"'; return 'TENTH'; }
("the"\s+)?"last" { yytext = '"last"'; return 'LAST'; }
("the"\s+)?"next" { yytext = '"next"'; return 'NEXT'; }
("the"\s+)?("previous"|"prev") { yytext = '"prev"'; return 'PREV'; }
// forward declaration of properties both in global and other, need to distinguish by 'of'
"name"\s+"of" { yytext = '"name"'; return 'NAME_OF'; }
"id"\s+"of" { yytext = '"id"'; return 'ID_OF'; }
"scriptingLanguage"\s"of" { yytext = '"scriptingLanguage"'; return 'SCRIPTING_LANGUAGE_OF'; }

// operators
"+" return '+'
"-" return '-'
"*" return '*'
"/" return '/'
"div" return 'DIV'
"mod" return 'MOD'
"^" return '^'
//"!" return '!'
//"%" return '%'
"(" return '('
")" return ')'
"," return ','
"or" return 'OR'
"and" return 'AND'
"is"\s+"not"\s+"within" return 'IS_NOT_WITHIN'
"is"\s+"within" return 'IS_WITHIN'
("is"\s+"not"\s+"an"|"is"\s+"not"\s+"a") { yytext = "is not a"; return 'IS_NOT_A'; }
("is"\s+"an"|"is"\s+"a") { yytext = "is a"; return 'IS_A'; }
"is"\s+"not"\s+"in"  { yytext = "is not in"; return 'IS_NOT_IN'; }
"is"\s+"in"  { yytext = "is in"; return 'IS_IN'; }
"is"\s+"not"  { yytext = "is not"; return 'IS_NOT'; }
"is" return 'IS'
"contains" return 'CONTAINS'
"<=" return 'LE'
">=" return 'GE'
"<" return 'LT'
">" return 'GT'
"=" return 'EQUAL'
// fixed: not sure the use of this & and && in HyperTalk... -> concatination
//"&&" return "&&"
//"&" return '&'
"&&" return "OP_AMPAMP"
"&" return 'OP_AMP'
("there"\s+"is"\s+"not"\s+"an"|"there"\s+"is"\s+"not"\s+"a") { yytext = "there is not a"; return 'THERE_IS_NOT_A'; }
("there"\s+"is"\s+"an"|"there"\s+"is"\s+"a") { yytext = "there is a"; return 'THERE_IS_A'; }
"there"\s+"is"\s+"no" return 'THERE_IS_NOT_A' // fixed: is THERE_IS_NO same has THERE_IS_NOT_A ? -> Yes
"not" return 'NOT'
"the" return 'THE'
"with" return 'WITH'
"text" return 'TEXT'
"tool" return 'TOOL'
"at" return 'AT'
"from" return 'FROM'
"tempo" return 'TEMPO'
"female"\s+"voice" { yytext = '"builtin female voice"'; return 'FEMALE_VOICE'; }
"male"\s+"voice" { yytext = '"builtin male voice"'; return 'MALE_VOICE'; }
"neuter"\s+"voice" { yytext = '"builtin neuter voice"'; return 'NEUTER_VOICE'; }
"voice" return 'VOICE'
"off" { yytext = '"' + yytext + '"'; return 'OFF'; }
"by" return 'BY'
"out" return 'OUT'
"center" return 'CENTER'
"clear" return 'CLEAR'
"ticks" { yytext = '"' + yytext + '"'; return 'TICKS'; }
("seconds"|"sec") { yytext = '"seconds"'; return 'SECONDS'; }
"forever" return 'FOREVER'
"exit"\s+"repeat" return 'EXIT_REPEAT'
"times" return 'TIMES'
"down"\s+"to" return 'DOWN_TO'

// constants
"true" { yytext = '"' + yytext + '"'; return 'TRUE'; }
"false" { yytext = '"' + yytext + '"'; return 'FALSE'; }
"up" { yytext = '"' + yytext + '"'; return 'UP'; }
"down" { yytext = '"' + yytext + '"'; return 'DOWN'; }
"empty" { yytext = '"' + yytext + '"'; return 'EMPTY'; }
"quote" { yytext = '"' + yytext + '"'; return 'QUOTE'; }
"return" { yytext = '"' + yytext + '"'; return 'RETURN'; }
"space" { yytext = '"' + yytext + '"'; return 'SPACE'; }
"tab" { yytext = '"' + yytext + '"'; return 'TAB'; }
"colon" { yytext = '"' + yytext + '"'; return 'COLON'; }
"comma" { yytext = '"' + yytext + '"'; return 'COMMA'; }
"pi" { yytext = '"' + yytext + '"'; return 'PI'; }

// reserved keywords
"on" { yytext = '"' + yytext + '"'; return 'ON'; }
"function" { yytext = '"' + yytext + '"'; return 'FUNCTION'; }
"end" { yytext = '"' + yytext + '"'; return 'END'; }
"pass" { yytext = '"' + yytext + '"'; return 'PASS'; }
"return" { yytext = '"' + yytext + '"'; return 'RETURN'; }
"repeat" { yytext = '"' + yytext + '"'; return 'REPEAT'; }
"next" { yytext = '"' + yytext + '"'; return 'NEXT'; }
"if" { yytext = '"' + yytext + '"'; return 'IF'; }
"then" { yytext = '"' + yytext + '"'; return 'THEN'; }
"else"\s+"if" { yytext = '"else if"'; return 'ELSE_IF'; }
"else" { yytext = '"' + yytext + '"'; return 'ELSE'; }
"do" { yytext = '"' + yytext + '"'; return 'DO'; }
"send" { yytext = '"' + yytext + '"'; return 'SEND'; }
"global" { yytext = '"' + yytext + '"'; return 'GLOBAL'; }
"until" { yytext = '"' + yytext + '"'; return 'UNTIL'; }
"while" { yytext = '"' + yytext + '"'; return 'WHILE'; }

// navigation commands
("go"\s+"to"|"go") { yytext = "go"; return 'GO'; }
"push" return 'PUSH'
"pop" return 'POP'
"help" return 'HELP'
"open" return 'OPEN'
"close" return 'CLOSE'
"lock"\s+"recent" return 'LOCK_RECENT_CMD' // confilict with lockRecent property
"unlock"\s+"recent" return 'UNLOCK_RECENT_CMD'
"answer"\s+"program" return 'ANSWER_PROGRAM'
"arrowKey" return 'ARROW_KEY'

// action commands
"put" return 'PUT'
"get" return 'GET'
"delete" return 'DELETE'
"select" return 'SELECT'
"dial" return 'DIAL'
"choose" return 'CHOOSE'
"click" return 'CLICK'
"drag" return 'DRAG'
"type" return 'TYPE'

// sound commands
"beep" return 'BEEP'
"play"\s+"stop" return 'PLAY_STOP'
"stop"\s+"sound" return 'STOP_SOUND'
"stop"\s+"speech" return 'STOP_SPEECH'
"play" return 'PLAY'
"speak" return 'SPEAK'
"debug"\s+"sound" return 'DEBUG_SOUND'

// arithmatic commands
"add" return 'ADD'
"subtract" return 'SUBTRACT'
"multiply" return 'MULTIPLY'
"divide" return 'DIVIDE'
"convert" return 'CONVERT'

// search commands
"find"\s+"whole" return 'FIND_WHOLE'
"find"\s+"word" return 'FIND_WORD'
("find"\s+"characters"|"find"\s+"chars") return 'FIND_CHARS'
"find"\s+"string" return 'FIND_STRING'
"find" return 'FIND'
"sort"\s+"cards" return 'SORT_CARDS'
"sort"\s+"items" return 'SORT_ITEMS'
"sort"\s+"lines" return 'SORT_LINES'
"mark"\s+"cards"\s+"where" return 'MARK_CARDS_WHERE'
"mark"\s+"cards"\s+"by"\s+"finding" return 'MARK_CARDS_BY_FINDING'
"mark"\s+"all"\s+"cards" return 'MARK_ALL_CARDS'
"mark" return 'MARK'
"unmark"\s+"cards"\s+"where" return 'UNMARK_CARDS_WHERE'
"unmark"\s+"cards"\s+"by"\s+"finding" return 'UNMARK_CARDS_BY_FINDING'
"unmark"\s+"all"\s+"cards" return 'UNMARK_ALL_CARDS'
"unmark" return 'UNMARK'
"go"\s+"marked"\s+"card" return 'GO_MARKED_CARD'

// display manipulation commands
("visual"\s+"effect"|"visual") { yytext = '"visual"'; return 'VISUAL'; }
"flash" return 'FLASH'
"answer" return 'ANSWER'
"ask"\s+"password" return 'ASK_PASSWORD'
"ask" return 'ASK'
"lock"\s+"screen" return 'LOCK_SCREEN'
"unlock"\s+"screen" return 'UNLOCK_SCREEN'
"palette" return 'PALETTE'
"picture" return 'PICTURE'

// visual effects
"barn"\s+"door" { yytext = 'barn door'; return 'BARN_DOOR'; }
"checkerboard" { yytext = '"' + yytext + '"'; return 'CHECKERBOARD'; }
"dissolve" { yytext = '"' + yytext + '"'; return 'DISSOLVE'; }
"iris" return 'IRIS'
// "push" already exist as different token, so make these as chunk token.
"push"\s+"left" { yytext = '"push left"'; return 'PUSH_LEFT'; }
"push"\s+"right" { yytext = '"push right"'; return 'PUSH_RIGHT'; }
"push"\s+"up" { yytext = '"push up"'; return 'PUSH_UP'; }
"push"\s+"down" { yytext = '"push down"'; return 'PUSH_DOWN'; }
// "scroll" already exist as different token, so make these as chunk token.
"scroll"\s+"left" { yytext = '"scroll left"'; return 'SCROLL_LEFT'; }
"scroll"\s+"right" { yytext = '"scroll right"'; return 'SCROLL_RIGHT'; }
"scroll"\s+"up" { yytext = '"scroll up"'; return 'SCROLL_UP'; }
"scroll"\s+"down" { yytext = '"scroll down"'; return 'SCROLL_DOWN'; }
"shrink" return 'SHRINK'
"stretch" return 'STRETCH'
"venetian"\s+"blinds" { yytext = '"venetian blinds"'; return 'VENETIAN_BLINDS'; }
"wipe" return 'WIPE'
"zoom" return 'ZOOM'
"plain" return 'PLAIN'
// visual effect speed
("very"\s+"slowly"|"very"\s+"slow") { yytext = '"very slow"'; return 'VERY_SLOW'; }
("slowly"|"slow") { yytext = '"slow"'; return 'SLOW'; }
"fast" { yytext = '"' + yytext + '"'; return 'FAST'; }
"very"\s+"fast" { yytext = '"very fast"'; return 'VERY_FAST'; }
// visual effect image. append 'to' to make there chunk token, since 'card' token used on other place
"black" { yytext = '"' + yytext + '"'; return 'BLACK'; }
"white" { yytext = '"' + yytext + '"'; return 'WHITE'; }
("gray"|"grey") { yytext = '"gray"'; return 'GRAY'; }
"inverse" { yytext = '"' + yytext + '"'; return 'INVERSE'; }
//"card" { yytext = '"card"'; return 'CARD'; }

// object manipulation commands
"cards" return 'CARDS'
"hide"\s+"groups" return 'HIDE_GROUPS'
"show"\s+"groups" return 'SHOW_GROUPS'
"hide" return 'HIDE'
"show" return 'SHOW'
"get" return 'GET'
"set" return 'SET'
"edit"\s+"script" return 'EDIT_SCRIPT'
"reset"\s+"paint" return 'RESET_PAINT'
"select"\s+"empty" return 'SELECT_EMPTY'
"select"\s+"line" return 'SELECT_LINE'
"select" return 'SELECT'
"create"\s+"stack" return 'CREATE_STACK'
"save" return 'SAVE'
"copy"\s+"template" return 'COPY_TEMPLATE'
"enter"\s+"in"\s+"field" return 'ENTER_IN_FIELD'

// other hide-able parts
"menuBar" { yytext = '"' + yytext + '"'; return 'MENUBAR'; }
"titleBar" { yytext = '"' + yytext + '"'; return 'TITLEBAR'; }

// file manipulation commands
"open"\s+"file" return 'OPEN_FILE'
"close"\s+"file" return 'CLOSE_FILE'
"answer"\s+"file" return 'ANSWER_FILE'
"ask"\s+"file" return 'ASK_FILE'
//"read" return 'READ'
"read"\s+"from"\s+"file" return 'READ_FROM_FILE'
"write" return 'WRITE'
"print" return 'PRINT'
"import"\s+"paint" return 'IMPORT_PAINT'
"export"\s+"paint" return 'EXPORT_PAINT'
"file" return 'FILE'

// menu commands
"doMenu" return 'DO_MENU'
"create"\s+"menu" return 'CREATE_MENU'
"put" return 'PUT'
"delete" return 'DELETE'
"reset"\s+"menubar" return 'RESET_MENUBAR'
"enable" return 'ENABLE'
"disable" return 'DISABLE'
"without"\s+"dialog" return 'WITHOUT_DIALOG'
"with"\s+"dialog" return 'WITH_DIALOG'

// printing commands
"print" return 'PRINT'
"reset"\s+"printing" return 'RESET_PRINTING'
"open"\s+"printing" return 'OPEN_PRINTING'
"print"\s+"card" return 'PRINT_CARD'
"close"\s+"printing" return 'CLOSE_PRINTING'
"open"\s+"report"\s+"printing" return 'OPEN_REPORT_PRINTING'

// script commands
("wait"\s+"for"|"wait") return 'WAIT'
"exit"\s+"to"\s+"HyperCard" return 'EXIT_TO_HYPERCARD'
"lock"\s+"messages" return 'LOCK_MESSAGES_CMD' // append _CMD to avoid conflict with lockMessages property
"unlock"\s+"messages" return 'UNLOCK_MESSAGES_CMD'
"lock"\s+"error"\s+"dialogs" return 'LOCK_ERROR_DIALOGS_CMD'
"unlock"\s+"error"\s+"dialogs" return 'UNLOCK_ERROR_DIALOGS_CMD'
"pass" return 'PASS'
"send" return 'SEND'
"start"\s+"using" return 'START_USING'
"stop"\s+"using" return 'STOP_USING'
"debug"\s+"checkpoint" return 'DEBUG_CHECKPOINT'
"magic" return 'MAGIC'

// window manipulation commands
"close"\s+"window" return 'CLOSE_WINDOW'

// key manipulation commands // NOTE: all those dups with system message
"commandKeyDown" { yytext = '"' + yytext + '"'; return 'COMMAND_KEY_DOWN'; }
"controlKey" { yytext = '"' + yytext + '"'; return 'CONTROL_KEY'; }
"enterKey" { yytext = '"' + yytext + '"'; return 'ENTER_KEY'; }
"returnKey" { yytext = '"' + yytext + '"'; return 'RETURN_KEY'; }
"tabKey" { yytext = '"' + yytext + '"'; return 'TAB_KEY'; }

// modifier keys
("CommandKey"|"commandKey") { yytext = '"commandKey"'; return 'COMMAND_KEY'; }
("OptionKey"|"optionKey") { yytext = '"optionKey"'; return 'OPTION_KEY'; }
("ShiftKey"|"shiftKey") { yytext = '"shiftKey"'; return 'SHIFT_KEY'; }

// tools
"browse"\s+"tool" { yytext = '"Browse"'; return 'BROWSE_TOOL'; }
"button"\s+"tool" { yytext = '"Edit"'; return 'BUTTON_TOOL'; } // use Edit tool
"field"\s+"tool" { yytext = '"Edit"'; return 'FIELD_TOOL'; } // use Edit tool
"edit"\s+"tool" { yytext = '"Edit"'; return 'EDIT_TOOL'; } // new
"pattern"\s+"tool" { yytext = '"Pattern"'; return 'PATTERN_TOOL'; } // new
"crop"\s+"tool" { yytext = '"Crop"'; return 'CROP_TOOL'; } // new
("eye"\s+"drop"|"eyedrop")\s+"tool" { yytext = '"Eyedrop"'; return 'EYEDROP_TOOL'; } // new
"scroll"\s+"tool" { yytext = '"Scroll"'; return 'SCROLL_TOOL'; } // new
("magic"\s+"wand"|"magicwand")\s+"tool" { yytext = '"Magic Wand"'; return 'MAGICWAND_TOOL'; } // new
"select"\s+"tool" { yytext = '"Select"'; return 'SELECT_TOOL'; }
"lasso"\s+"tool" { yytext = '"lasso"'; return 'LASSO_TOOL'; }
"pencil"\s+"tool" { yytext = '"Pencil"'; return 'PENCIL_TOOL'; }
"brush"\s+"tool" { yytext = '"Brush"'; return 'BRUSH_TOOL'; }
"eraser"\s+"tool" { yytext = '"Eraser"'; return 'ERASER_TOOL'; }
"line"\s+"tool" { yytext = '"Line"'; return 'LINE_TOOL'; }
("spray"\s+"can"|"spray")\s+"tool" { yytext = '"spray"'; return 'SPRAY_TOOL'; }
("rectangle"|"rect")\s+"tool" { yytext = '"Rect"'; return 'RECT_TOOL'; }
"round"\s+("rectangle"|"rect")\s+"tool" { yytext = '"roundrect"'; return 'ROUND_RECT_TOOL'; }
"bucket"\s+"tool" { yytext = '"Bucket"'; return 'BUCKET_TOOL'; }
"oval"\s+"tool" { yytext = '"Oval"'; return 'OVAL_TOOL'; }
"curve"\s+"tool" { yytext = '"curve"'; return 'CURVE_TOOL'; }
"text"\s+"tool" { yytext = '"Text"'; return 'TEXT_TOOL'; }
("regular"|"reg")\s+("polygon"|"poly")\s+"tool" { yytext = '"regpoly"'; return 'REGULAR_POLYGON_TOOL'; }
("polygon"|"poly")\s+"tool" { yytext = '"polygon"'; return 'POLYGON_TOOL'; }

// global properties
"blindTyping" { yytext = '"' + yytext + '"'; return 'BLIND_TYPING'; }
"cursor" { yytext = '"' + yytext + '"'; return 'CURSOR'; }
"debugger" { yytext = '"' + yytext + '"'; return 'DEBUGGER'; }
"dialingTime" { yytext = '"' + yytext + '"'; return 'DIALING_TIME'; }
"dialingVolume" { yytext = '"' + yytext + '"'; return 'DIALING_VOLUME'; }
"dragSpeed" { yytext = '"' + yytext + '"'; return 'DRAG_SPEED'; }
"editBkgnd" { yytext = '"' + yytext + '"'; return 'EDIT_BKGND'; }
"environment" { yytext = '"' + yytext + '"'; return 'ENVIRONMENT'; }
"id" { yytext = '"' + yytext + '"'; return 'ID'; }
"itemDelimiter" { yytext = '"' + yytext + '"'; return 'ITEMDELIMITER'; }
"language" { yytext = '"' + yytext + '"'; return 'LANGUAGE'; }
"lockErrorDialogs" { yytext = '"' + yytext + '"'; return 'LOCK_ERROR_DIALOGS'; }
"lockMessages" { yytext = '"' + yytext + '"'; return 'LOCK_MESSAGES'; }
"lockRecent" { yytext = '"' + yytext + '"'; return 'LOCK_RECENT'; }
"lockScreen" { yytext = '"' + yytext + '"'; return 'LOCK_SCREEN'; }
"longWindowTitles" { yytext = '"' + yytext + '"'; return 'LONG_WINDOW_TITLES'; }
"messageWatcher" { yytext = '"' + yytext + '"'; return 'MESSAGE_WATCHER'; }
"name" { yytext = '"' + yytext + '"'; return 'NAME'; }
"numberFormat" { yytext = '"' + yytext + '"'; return 'NUMBER_FORMAT'; }
"powerKeys" { yytext = '"' + yytext + '"'; return 'POWER_KEYS'; }
"printMargins" { yytext = '"' + yytext + '"'; return 'PRINT_MARGINS'; }
"printTextAlign" { yytext = '"' + yytext + '"'; return 'PRINT_TEXT_ALIGN'; }
"printTextFont" { yytext = '"' + yytext + '"'; return 'PRINT_TEXT_FONT'; }
"printTextHeight" { yytext = '"' + yytext + '"'; return 'PRINT_TEXT_HEIGHT'; }
"printTextSize" { yytext = '"' + yytext + '"'; return 'PRINT_TEXT_SIZE'; }
"printTextStyle" { yytext = '"' + yytext + '"'; return 'PRINT_TEXT_STYLE'; }
"scriptEditor" { yytext = '"' + yytext + '"'; return 'SCRIPT_EDITOR'; }
"scriptingLanguage" { yytext = '"' + yytext + '"'; return 'SCRIPTING_LANGUAGE'; }
"scriptTextFont" { yytext = '"' + yytext + '"'; return 'SCRIPT_TEXT_FONT'; }
"scriptTextSize" { yytext = '"' + yytext + '"'; return 'SCRIPT_TEXT_SIZE'; }
"stacksInUse" { yytext = '"' + yytext + '"'; return 'STACKS_IN_USE'; }
"suspended" { yytext = '"' + yytext + '"'; return 'SUSPENDED'; }
"textArrows" { yytext = '"' + yytext + '"'; return 'TEXT_ARROWS'; }
"traceDelay" { yytext = '"' + yytext + '"'; return 'TRACE_DELAY'; }
"userLevel" { yytext = '"' + yytext + '"'; return 'USER_LEVEL'; }
"userModify" { yytext = '"' + yytext + '"'; return 'USER_MODIFY'; }
"variableWatcher" { yytext = '"' + yytext + '"'; return 'VARIABLE_WATCHER'; }
"soundChannel" { yytext = '"' + yytext + '"'; return 'SOUND_CHANNEL'; }

// menu properties
"checkMark" { yytext = '"' + yytext + '"'; return 'CHECK_MARK'; }
"markChar" { yytext = '"' + yytext + '"'; return 'MARK_CHAR'; }
("commandChar"|"cmdChar") { yytext = '"commandChar"'; return 'COMMAND_CHAR'; }
"enabled" { yytext = '"' + yytext + '"'; return 'ENABLED'; }
("menuMessage"|"menuMsg") { yytext = '"menuMessage"'; return 'MENU_MESSAGE'; }
"name" { yytext = '"' + yytext + '"'; return 'NAME'; }
"rect" { yytext = '"' + yytext + '"'; return 'RECT'; }
"textStyle" { yytext = '"' + yytext + '"'; return 'TEXT_STYLE'; }
"visible" { yytext = '"' + yytext + '"'; return 'VISIBLE'; }

// painting properties
"brush" { yytext = '"' + yytext + '"'; return 'BRUSH'; }
"centered" { yytext = '"' + yytext + '"'; return 'CENTERED'; }
"filled" { yytext = '"' + yytext + '"'; return 'FILLED'; }
"grid" { yytext = '"' + yytext + '"'; return 'GRID'; }
"lineSize" { yytext = '"' + yytext + '"'; return 'LINE_SIZE'; }
"multiple" { yytext = '"' + yytext + '"'; return 'MULTIPLE'; }
"multiSpace" { yytext = '"' + yytext + '"'; return 'MULTI_SPACE'; }
"pattern" { yytext = '"' + yytext + '"'; return 'PATTERN'; }
"polySides" { yytext = '"' + yytext + '"'; return 'POLY_SIDES'; }
"textAlign" { yytext = '"' + yytext + '"'; return 'TEXT_ALIGN'; }
"textFont" { yytext = '"' + yytext + '"'; return 'TEXT_FONT'; }
"textHeight" { yytext = '"' + yytext + '"'; return 'TEXT_HEIGHT'; }
"textSize" { yytext = '"' + yytext + '"'; return 'TEXT_SIZE'; }
"textStyle" { yytext = '"' + yytext + '"'; return 'TEXT_STYLE'; }

// stack, card, background properties
"cantAbort" { yytext = '"' + yytext + '"'; return 'CANT_ABORT'; }
"cantDelete" { yytext = '"' + yytext + '"'; return 'CANT_DELETE'; }
"cantModify" { yytext = '"' + yytext + '"'; return 'CANT_MODIFY'; }
"cantPeek" { yytext = '"' + yytext + '"'; return 'CANT_PEEK'; }
"freeSize" { yytext = '"' + yytext + '"'; return 'FREE_SIZE'; }
"size" { yytext = '"' + yytext + '"'; return 'SIZE'; }
"id" { yytext = '"' + yytext + '"'; return 'ID'; }
"marked" { yytext = '"' + yytext + '"'; return 'MARKED'; }
"name" { yytext = '"' + yytext + '"'; return 'NAME'; }
"number" { yytext = '"' + yytext + '"'; return 'NUMBER'; }
"owner" { yytext = '"' + yytext + '"'; return 'OWNER'; }
"rect" { yytext = '"' + yytext + '"'; return 'RECT'; }
"reportTemplates" { yytext = '"' + yytext + '"'; return 'REPORT_TEMPLATES'; }
"script" { yytext = '"' + yytext + '"'; return 'SCRIPT'; }
"scriptingLanguage" { yytext = '"' + yytext + '"'; return 'SCRIPTING_LANGUAGE'; }
"showPict" { yytext = '"' + yytext + '"'; return 'SHOW_PICT'; }

// field properties
"autoSelect" { yytext = '"' + yytext + '"'; return 'AUTO_SELECT'; }
"autoTab" { yytext = '"' + yytext + '"'; return 'AUTO_TAB'; }
"dontSearch" { yytext = '"' + yytext + '"'; return 'DONT_SEARCH'; }
"dontWrap" { yytext = '"' + yytext + '"'; return 'DONT_WRAP'; }
"fixedLineHeight" { yytext = '"' + yytext + '"'; return 'FIXED_LINE_HEIGHT'; }
"id" { yytext = '"' + yytext + '"'; return 'ID'; }
"left" { yytext = '"' + yytext + '"'; return 'LEFT'; }
"top" { yytext = '"' + yytext + '"'; return 'TOP'; }
"right" { yytext = '"' + yytext + '"'; return 'RIGHT'; }
"bottom" { yytext = '"' + yytext + '"'; return 'BOTTOM'; }
"topLeft" { yytext = '"' + yytext + '"'; return 'TOP_LEFT'; }
("bottomRight"|"botRight") { yytext = '"bottomRight"'; return 'BOTTOM_RIGHT'; }
"width" { yytext = '"' + yytext + '"'; return 'WIDTH'; }
"height" { yytext = '"' + yytext + '"'; return 'HEIGHT'; }
"loc" { yytext = '"' + yytext + '"'; return 'LOC'; }
"lockText" { yytext = '"' + yytext + '"'; return 'LOCK_TEXT'; }
"showLines" { yytext = '"' + yytext + '"'; return 'SHOW_LINES'; }
"wideMargines" { yytext = '"' + yytext + '"'; return 'WIDE_MARGINS'; }
"multipleLines" { yytext = '"' + yytext + '"'; return 'MULTIPLE_LINES'; }
"name" { yytext = '"' + yytext + '"'; return 'NAME'; }
"number" { yytext = '"' + yytext + '"'; return 'NUMBER'; }
"rect" { yytext = '"' + yytext + '"'; return 'RECT'; }
"scroll" { yytext = '"' + yytext + '"'; return 'SCROLL'; }
"script" { yytext = '"' + yytext + '"'; return 'SCRIPT'; }
"scriptingLanguage" { yytext = '"' + yytext + '"'; return 'SCRIPTING_LANGUAGE'; }
"sharedText" { yytext = '"' + yytext + '"'; return 'SHARED_TEXT'; }
"style" { yytext = '"' + yytext + '"'; return 'STYLE'; }
"textAlign" { yytext = '"' + yytext + '"'; return 'TEXT_ALIGN'; }
"textFont" { yytext = '"' + yytext + '"'; return 'TEXT_FONT'; }
"textHeight" { yytext = '"' + yytext + '"'; return 'TEXT_HEIGHT'; }
"textSize" { yytext = '"' + yytext + '"'; return 'TEXT_SIZE'; }
"textStyle" { yytext = '"' + yytext + '"'; return 'TEXT_STYLE'; }
"visible" { yytext = '"' + yytext + '"'; return 'VISIBLE'; }

// button properties
"autoHilite" { yytext = '"' + yytext + '"'; return 'AUTO_HILITE'; }
"showName" { yytext = '"' + yytext + '"'; return 'SHOW_NAME'; }
"left" { yytext = '"' + yytext + '"'; return 'LEFT'; }
"top" { yytext = '"' + yytext + '"'; return 'TOP'; }
"right" { yytext = '"' + yytext + '"'; return 'RIGHT'; }
"bottom" { yytext = '"' + yytext + '"'; return 'BOTTOM'; }
"topLeft" { yytext = '"' + yytext + '"'; return 'TOP_LEFT'; }
("bottomRight"|"botRight") { yytext = '"bottomRight"'; return 'BOTTOM_RIGHT'; }
"width" { yytext = '"' + yytext + '"'; return 'WIDTH'; }
"height" { yytext = '"' + yytext + '"'; return 'HEIGHT'; }
"enabled" { yytext = '"' + yytext + '"'; return 'ENABLED'; }
"family" { yytext = '"' + yytext + '"'; return 'FAMILY'; }
"hilite" { yytext = '"' + yytext + '"'; return 'HILITE'; }
"icon" { yytext = '"' + yytext + '"'; return 'ICON'; }
"id" { yytext = '"' + yytext + '"'; return 'ID'; }
"loc" { yytext = '"' + yytext + '"'; return 'LOC'; }
"name" { yytext = '"' + yytext + '"'; return 'NAME'; }
"number" { yytext = '"' + yytext + '"'; return 'NUMBER'; }
"partNumber" { yytext = '"' + yytext + '"'; return 'PART_NUMBER'; }
"rect" { yytext = '"' + yytext + '"'; return 'RECT'; }
"script" { yytext = '"' + yytext + '"'; return 'SCRIPT'; }
"scriptingLanguage" { yytext = '"' + yytext + '"'; return 'SCRIPTING_LANGUAGE'; }
"sharedHilite" { yytext = '"' + yytext + '"'; return 'SHARED_HILITE'; }
"style" { yytext = '"' + yytext + '"'; return 'STYLE'; }
"textAlign" { yytext = '"' + yytext + '"'; return 'TEXT_ALIGN'; }
"textFont" { yytext = '"' + yytext + '"'; return 'TEXT_FONT'; }
"textHeight" { yytext = '"' + yytext + '"'; return 'TEXT_HEIGHT'; }
"textSize" { yytext = '"' + yytext + '"'; return 'TEXT_SIZE'; }
"textStyle" { yytext = '"' + yytext + '"'; return 'TEXT_STYLE'; }
"titleWidth" { yytext = '"' + yytext + '"'; return 'TITLE_WIDTH'; }
"visible" { yytext = '"' + yytext + '"'; return 'VISIBLE'; }

// objects
("card"|"cd")\s+("field"|"fld") { yytext = '"card field"'; return 'CARD_FIELD'; }
("background"|"bkgnd"|"bg")\s+("field"|"fld") { yytext = '"background field"'; return 'BACKGROUND_FIELD'; }
("stack"|"stk")\s+("field"|"fld") { yytext = '"stack field"'; return 'STACK_FIELD'; }
"part" { yytext = '"' + yytext + '"'; return 'PART'; }
("background"|"bkgnd"|"bg") { yytext = '"background"'; return 'BACKGROUND'; }
("button"|"btn") { yytext = '"button"'; return 'BUTTON'; }
("card"|"cd") { yytext = '"card"'; return 'CARD'; }
("field"|"fld") { yytext = '"field"'; return 'FIELD'; }
("stack"|"stk") { yytext = '"stack"'; return 'STACK'; }

// pointers
"back" return 'BACK' // accept as token but not used in grammar... ('prev' will do)
"forth" return 'FORTH' // accept as token but not used in grammar... ('next' will do)
"me" { yytext = '"' + yytext + '"'; return 'ME'; }
"this" { yytext = '"' + yytext + '"'; return 'THIS'; }
"target" { yytext = '"' + yytext + '"'; return 'TARGET'; }

// containers
"clipboard" { yytext = '"' + yytext + '"'; return 'CLIPBOARD'; }
("field"|"fld") { yytext = '"field"'; return 'FIELD'; }
"it" { yytext = '"' + yytext + '"'; return 'IT'; }
"menuItem" { yytext = '"' + yytext + '"'; return 'MENU_ITEM'; }
//"menu" { yytext = '"' + yytext + '"'; return 'MENU'; }
"menu" { yytext = '"menuBar"'; return 'MENU'; }
("message window"|"message box"|"message"|"msgbox"|"msg") { yytext = '"message box"'; return 'MESSAGE_BOX'; }
"messageWindow" { yytext = '"' + yytext + '"'; return 'MESSAGE_WINDOW'; }
"selection" { yytext = '"' + yytext + '"'; return 'SELECTION'; }

// prepositions
"after" { yytext = '"' + yytext + '"'; return 'AFTER'; }
"all" { yytext = '"' + yytext + '"'; return 'ALL'; }
"before" { yytext = '"' + yytext + '"'; return 'BEFORE'; }
"in" { yytext = '"' + yytext + '"'; return 'IN'; }
"into" { yytext = '"' + yytext + '"'; return 'INTO'; }
"to" { yytext = '"' + yytext + '"'; return 'TO'; }
"of" { yytext = '"' + yytext + '"'; return 'OF'; }

// chunks
("character"|"char") { yytext = '"char"'; return 'CHARACTER'; }
"item" { yytext = '"' + yytext + '"'; return 'ITEM'; }
"line" { yytext = '"' + yytext + '"'; return 'LINE'; }
"word" { yytext = '"' + yytext + '"'; return 'WORD'; }

// system messages
"mouseDown" { return 'MOUSE_DOWN'; }
"mouseStillDown" { return 'MOUSE_STILL_DOWN'; }
"mouseUp" { return 'MOUSE_UP'; }
"mouseDoubleClick" { return 'MOUSE_DOUBLE_CLICK'; }
"mouseEnter" { return 'MOUSE_ENTER'; }
"mouseWithin" { return 'MOUSE_WITHIN'; }
"mouseLeave" { return 'MOUSE_LEAVE'; }
"exitField" { return 'EXIT_FIELD'; }
"keyDown" { return 'KEY_DOWN'; }
"commandKeyDown" { return 'COMMAND_KEY_DOWN'; } // mac specific. remove later
"returnKey" { return 'RETURN_KEY'; } // mac specific. remove later
"enterKey" { return 'ENTER_KEY'; }
"tabKey" { return 'TAB_KEY'; }
"enterInField" { return 'ENTER_IN_FIELD'; }
"returnInField" { return 'RETURN_IN_FIELD'; } // mac specific. remove later
"arrowKey" { return 'ARROW_KEY'; }
"controlKey" { return 'CONTROL_KEY'; } // mac specific. remove later
"functionKey" { return 'FUNCTION_KEY'; } // mac specific. remove later
"doMenu" { return 'DO_MENU'; }
"suspendStack" { return 'SUSPEND_STACK'; }
"resumeStack" { return 'RESUME_STACK'; }
"startUp" { return 'START_UP'; }
"suspend" { return 'SUSPEND'; }
"resume" { return 'RESUME'; }
"quit" { return 'QUIT'; }
"appleEvent" { return 'APPLE_EVENT'; } // mac specific. remove later
"help" { return 'HELP'; }
"close" { return 'CLOSE'; }
"sizeWindow" { return 'SIZE_WINDOW'; }
"moveWindow" { return 'MOVE_WINDOW'; }
"mouseDownInPicture" { return 'MOUSE_DOWN_IN_PICTURE'; }
"mouseUpInPicture" { return 'MOUSE_UP_IN_PICTURE'; }
"openPicture" { return 'OPEN_PICTURE'; }
"openPalette" { return 'OPEN_PALETTE'; }
"closePicture" { return 'CLOSE_PICTURE'; }
"closePalette" { return 'CLOSE_PALETTE'; }
"choose" { return 'CHOOSE'; }
"closeCard" { return 'CLOSE_CARD'; }
"closeField" { return 'CLOSE_FIELD'; }
"closeBackground" { return 'CLOSE_BACKGROUND'; }
"deleteBackground" { return 'DELETE_BACKGROUND'; }
"deleteButton" { return 'DELETE_BUTTON'; }
"deleteCard" { return 'DELETE_CARD'; }
"deleteField" { return 'DELETE_FIELD'; }
"deleteStack" { return 'DELETE_STACK'; }
"idle" { return 'IDLE'; }
"newBackground" { return 'NEW_BACKGROUND'; }
"newButton" { return 'NEW_BUTTON'; }
"newCard" { return 'NEW_CARD'; }
"newField" { return 'NEW_FIELD'; }
"newStack" { return 'NEW_STACK'; }
"openBackground" { return 'OPEN_BACKGROUND'; }
"openCard" { return 'OPEN_CARD'; }
"openField" { return 'OPEN_FIELD'; }
"openStack" { return 'OPEN_STACK'; }


[0-9]+(\.[0-9]+)? return 'NUMBER_LITERAL' // conflicted with 'number' property, so renamed this.
(\.[0-9]+) return 'NUMBER_LITERAL' // conflicted with 'number' property, so renamed this.
\d+ return 'INTEGER_LITERAL'
//[0-9]+("."\[0-9]+)?\b return 'NUMBER_LITERAL' // conflicted with 'number' property, so renamed this.
[a-zA-Z][a-zA-Z0-9_]* return 'IDENTIFIER'
\'([^']*)\' { return 'STRING_LITERAL'; } //! todo: handle escape and multibyte utf8
\"([^"]*)\" { return 'STRING_LITERAL'; } //! todo: handle escape and multibyte utf8

<<EOF>> return 'EOF'

// anything else from above is invalid token.
. return 'INVALID_TOKEN'

/lex

%start script

%% /* language grammer */

script
    : /* allow empty script */
    | script EOL /* allow empty new line */
    | script handler {
        parseHelper.handlers.push($2);
        $$ = parseHelper.handlers;
      }
    | script error { 
        var errtext = "detected error: " + $2 + ", line: " + @2.first_line + ", column: " + (@2.first_column+1);
        return { type: "error", text: errtext };
      }
    | script EOF {
        return parseHelper.handlers.splice(0, parseHelper.handlers.length);
      }
    ;

handler
    : ON system_message
        block
      END system_message {
          if ($2 !== $5) {
              return { type: "error", text: "detected error: begining and ending handler name is different: on " + $2 + ", end " + $5 };
          }
          var text = parseHelper.showVariables();
          text += "\n" + $3;
          parseHelper.clearVariables();
          $$ = { type: "handler", name: $2, text: text, exec: Function(text) };
      }
    | ON system_message variables
        block
      END system_message {
          if ($2 !== $6) {
              return { type: "error", text: "detected error: begining and ending handler name is different: on " + $2 + ", end " + $6 };
          }
          var args = $3;
          var text = parseHelper.showVariables();
          text += "\n" + $4;
          parseHelper.clearVariables();
          $$ = { type: "handler", name: $2, text: args + '\n' + text, exec: Function(args, text) };
      }

    | FUNCTION IDENTIFIER
        block
      END IDENTIFIER {
          if ($2 !== $5) {
              return { type: "error", text: "begining and ending function name is different: function " + $2 + ", end " + $5 };
          }
          var text = parseHelper.showVariables();
          text += "\n" + $3;
          parseHelper.clearVariables();
          $$ = { type: "function", name: $2, text: text, exec: Function(text) };
      }
    | FUNCTION IDENTIFIER variables
        block
      END IDENTIFIER {
          if ($2 !== $6) {
              return { type: "error", text: "begining and ending function name is different: function " + $2 + ", end " + $6 };
          }
          var args = $3;
          var text = parseHelper.showVariables();
          text += "\n" + $4;
          parseHelper.clearVariables();
          $$ = { type: "function", name: $2, text: args + '\n' + text, exec: Function(args, text) };
      }

    ;

block
    : stmt { $$ = $1; }
    | block stmt { $$ = $1 + $2; }
    ;

stmt
    : EOL { $$ = ''; }
    | command EOL { $$ = $1 + '\n'; }
    | keyword EOL { $$ = $1 + '\n'; }
    | function_call EOL { $$ = $1 + ';\n'; }
    | error {
        var errtext = "detected error: " + $1 + ", line: " + @1.first_line + ", column: " + (@1.first_column+1);
        return { type: "error", text: errtext };
      }
    ;

// bare token group

system_message
    : MOUSE_DOWN
    | MOUSE_STILL_DOWN
    | MOUSE_UP
    | MOUSE_DOUBLE_CLICK
    | MOUSE_ENTER 
    | MOUSE_WITHIN
    | MOUSE_LEAVE
    | EXIT_FIELD
    | KEY_DOWN
    | COMMAND_KEY_DOWN
    | RETURN_KEY
    | ENTER_KEY
    | TAB_KEY
    | ENTER_IN_FIELD
    | RETURN_IN_FIELD
    | ARROW_KEY
    | CONTROL_KEY
    | FUNCTION_KEY
    | DO_MENU
    | SUSPEND_STACK
    | RESUME_STACK
    | START_UP
    | SUSPEND
    | RESUME
    | QUIT
    | APPLE_EVENT
    | HELP
    | CLOSE
    | SIZE_WINDOW
    | MOVE_WINDOW
    | MOUSE_DOWN_IN_PICTURE
    | MOUSE_UP_IN_PICTURE
    | OPEN_PICTURE
    | OPEN_PALETTE
    | CLOSE_PICTURE
    | CLOSE_PALETTE
    | CHOOSE
    | CLOSE_CARD
    | CLOSE_FIELD
    | CLOSE_BACKGROUND
    | DELETE_BACKGROUND
    | DELETE_BUTTON
    | DELETE_CARD
    | DELETE_FIELD
    | DELETE_STACK
    | IDLE
    | NEW_BACKGROUND
    | NEW_BUTTON
    | NEW_CARD
    | NEW_FIELD
    | NEW_STACK
    | OPEN_BACKGROUND
    | OPEN_CARD
    | OPEN_FIELD
    | OPEN_STACK
    ;

constant
    : TRUE
    | FALSE
    | UP
    | DOWN
    | EMPTY
    | QUOTE
    | RETURN
    | SPACE
    | TAB
    | COLON
    | COMMA
    | PI
    ;

selecter_pointer
    : FIRST
    | SECOND
    | THIRD
    | FOURTH
    | FIFTH
    | SIXTH
    | SEVENTH
    | EIGHTH
    | NINTH
    | TENTH
    | LAST
    ;

direction_pointer
    : NEXT
    | PREV
    ;

arrow_pointer
    : UP
    | DOWN
    | RIGHT
    | LEFT
    ;

frame_pointer
    : THIS
    ;

object_pointer
    : ME
    ;

preposition_pointer
    : BEFORE
    | INTO
    | AFTER
//    | TO
    ;

part_object
    : BUTTON
    | FIELD
    ;

frame_object
    : CARD
    | BACKGROUND
    | STACK
    ;

tool_type
    : BROWSE_TOOL
    | BUTTON_TOOL
    | FIELD_TOOL
    | EDIT_TOOL
    | PATTERN_TOOL
    | CROP_TOOL
    | EYEDROP_TOOL
    | SCROLL_TOOL
    | MAGICWAND_TOOL
    | SELECT_TOOL
    | LASSO_TOOL
    | PENCIL_TOOL
    | BRUSH_TOOL
    | ERASER_TOOL
    | LINE_TOOL
    | SPRAY_TOOL
    | RECT_TOOL
    | ROUND_RECT_TOOL
    | BUCKET_TOOL
    | OVAL_TOOL
    | CURVE_TOOL
    | TEXT_TOOL
    | REGULAR_POLYGON_TOOL
    | POLYGON_TOOL
    ;

// property list

global_property
    : BLIND_TYPING
    | CURSOR
    | DEBUGGER
    | DIALING_TIME
    | DIALING_VOLUME
    | DRAG_SPEED
    | EDIT_BKGND
    | ENVIRONMENT
    | ID
    | ITEMDELIMITER
    | LANGUAGE
    | LOCK_ERROR_DIALOGS
    | LOCK_MESSAGES
    | LOCK_RECENT
    | LOCK_SCREEN
    | LONG_WINDOW_TITLES
    | MESSAGE_WATCHER
    | NAME
    | NUMBER_FORMAT
    | POWER_KEYS
    | PRINT_MARGINS
    | PRINT_TEXT_ALIGN
    | PRINT_TEXT_FONT
    | PRINT_TEXT_HEIGHT
    | PRINT_TEXT_SIZE
    | PRINT_TEXT_STYLE
    | SCRIPT_EDITOR
    | SCRIPTING_LANGUAGE
    | SCRIPT_TEXT_FONT
    | SCRIPT_TEXT_SIZE
    | STACKS_IN_USE
    | SUSPENDED
    | TEXT_ARROWS
    | TRACE_DELAY
    | USER_LEVEL
    | USER_MODIFY
    | VARIABLE_WATCHER
    | SOUND_CHANNEL
    ;

// note: property commented out is handled in other group
painting_property
    : BRUSH
    | CENTERED
    | FILLED
    | GRID
    | LINE_SIZE
    | MULTIPLE
    | MULTI_SPACE
    | PATTERN
    | POLY_SIDES
//    | TEXT_ALIGN
//    | TEXT_FONT
//    | TEXT_HEIGHT
//    | TEXT_SIZE
//    | TEXT_STYLE
    ;

// 'of' appended tokens
base_property_of
    : ID_OF
    | NAME_OF
    ;

scripting_language_of
    : SCRIPTING_LANGUAGE_OF
    ;

enabled_property
    : ENABLED
    ;

visible_property
    : VISIBLE
    ;

text_style_property // separeted from text_basic_property due to menu which only has this prop...
    : TEXT_STYLE
    ;
//! todo: add other text_basic_property to menu property

text_basic_property // both part object and painting has this prop.
    : TEXT_ALIGN
    | TEXT_FONT
    | TEXT_HEIGHT
    | TEXT_SIZE
    ;

object_property
    : RECT
    | NUMBER
    | SCRIPT
    ;
//! todo: revisit. humm, menu and menuItem cant set script, so its not object ?!

part_object_property
    : LEFT
    | TOP
    | RIGHT
    | BOTTOM
    | TOP_LEFT
    | BOTTOM_RIGHT
    | WIDTH
    | HEIGHT
    | LOC
    | PART_NUMBER
    | STYLE
    ;

field_object_property
    : AUTO_SELECT
    | AUTO_TAB
    | DONT_SEARCH
    | DONT_WRAP
    | FIXED_LINE_HEIGHT
//    | ID
//    | LEFT
//    | TOP
//    | RIGHT
//    | BOTTOM
//    | TOP_LEFT
//    | BOTTOM_RIGHT
//    | WIDTH
//    | HEIGHT
//    | LOC
    | LOCK_TEXT
    | SHOW_LINES
    | WIDE_MARGINS
    | MULTIPLE_LINES
//    | NAME
//    | NUMBER
//    | RECT
    | SCROLL
//    | SCRIPT
//    | SCRIPTING_LANGUAGE
    | SHARED_TEXT
//    | STYLE
//    | TEXT_ALIGN
//    | TEXT_FONT
//    | TEXT_HEIGHT
//    | TEXT_SIZE
//    | TEXT_STYLE
//    | VISIBLE
    ;

button_object_property
    : AUTO_HILITE
    | SHOW_NAME
//    | LEFT
//    | TOP
//    | RIGHT
//    | BOTTOM
//    | TOP_LEFT
//    | BOTTOM_RIGHT
//    | WIDTH
//    | HEIGHT
//    | ENABLED
    | FAMILY
    | HILITE
    | ICON
//    | ID
//    | LOC
//    | NAME
//    | NUMBER
//    | PART_NUMBER
//    | RECT
//    | SCRIPT
//    | SCRIPTING_LANGUAGE
    | SHARED_HILITE
//    | STYLE
//    | TEXT_ALIGN
//    | TEXT_FONT
//    | TEXT_HEIGHT
//    | TEXT_SIZE
//    | TEXT_STYLE
    | TITLE_WIDTH
//    | VISIBLE
    ;

frame_object_property
    : CANT_ABORT
    | CANT_DELETE
    | CANT_MODIFY
    | CANT_PEEK
    | FREE_SIZE
    | SIZE
//    | ID
    | MARKED
//    | NAME
//    | NUMBER
    | OWNER
//    | RECT
    | REPORT_TEMPLATES
//    | SCRIPT
//    | SCRIPTING_LANGUAGE
    | SHOW_PICT
    ;

//menubar_property // there is no menu bar specific property name
//    : ENABLED
//    | NAME
//    | RECT
//    | VISIBLE
//    ;

menuitem_property
    : CHECK_MARK
    | MARK_CHAR
    | COMMAND_CHAR
//    | ENABLED
    | MENU_MESSAGE
//    | NAME
//    | TEXT_STYLE
    ;

system_container // or more precisely, a text container which has chunk
    : CLIPBOARD
//    | FIELD
    | IT
//    | MENU
//    | MENU_ITEM
    | MESSAGE_BOX
    ;

chunk
    : CHARACTER
    | ITEM
    | LINE
    | WORD
    ;

modifier_key
    : COMMAND_KEY
    | OPTION_KEY
    | SHIFT_KEY
    ;

builtin_voice
    : FEMALE_VOICE
    | MALE_VOICE
    | NEUTER_VOICE
    ;

visual_effect
    : BARN_DOOR OPEN { $$ = '"' + $1 + ' ' + $2 + '"'; }
    | BARN_DOOR CLOSE { $$ = '"' + $1 + ' ' + $2 + '"'; }
    | CHECKERBOARD
    | DISSOLVE
    | IRIS OPEN { $$ = '"' + $1 + ' ' + $2 + '"'; }
    | IRIS CLOSE { $$ = '"' + $1 + ' ' + $2 + '"'; }
    | PUSH_LEFT
    | PUSH_RIGHT
    | PUSH_UP
    | PUSH_DOWN
    | SCROLL_LEFT
    | SCROLL_RIGHT
    | SCROLL_UP
    | SCROLL_DOWN
    | SHRINK TO TOP { $$ = '"shrink to top"'; }
    | SHRINK TO CENTER { $$ = '"shrink to center"'; }
    | SHRINK TO BOTTOM { $$ = '"shrink to bottom"'; }
    | STRETCH FROM TOP { $$ = '"stretch from top"'; }
    | STRETCH FROM CENTER { $$ = '"stretch from center"'; }
    | STRETCH FROM BOTTOM { $$ = '"stretch from bottom"'; }
    | VENETIAN_BLINDS
    | WIPE LEFT { $$ = '"wipe left"'; }
    | WIPE RIGHT { $$ = '"wipe right"'; }
    | WIPE UP { $$ = '"wipe up"'; }
    | WIPE DOWN { $$ = '"wipe down"'; }
    | ZOOM OPEN { $$ = '"' + $1 + ' ' + $2 + '"'; }
    | ZOOM CLOSE { $$ = '"' + $1 + ' ' + $2 + '"'; }
    | ZOOM IN { $$ = '"zoom in"'; }
    | ZOOM OUT { $$ = '"zoom out"'; }
    | PLAIN
    ;

visual_speed
    : VERY_SLOW
    | SLOW
    | FAST
    | VERY_FAST
    ;

visual_image
    : TO BLACK { $$ = $2; }
    | TO WHITE { $$ = $2; }
    | TO GRAY { $$ = $2; }
    | TO INVERSE { $$ = $2; }
//    | TO CARD { $$ = $2; } // confilct. for eg parse error if "add 1 to card field 2"
    ;


// build-up tokens from above bare token group

navigation_pointer
    : selecter_pointer
    | direction_pointer
    | frame_pointer
    ;

// frame related build-up
card_object_bare_clause
    : navigation_pointer { $$ = 'frame: "card", pointer: ' + $1; } // frame will default to card
    | navigation_pointer CARD { $$ = 'frame: ' + $2 + ', pointer: ' + $1; }
    | CARD expr { $$ = 'frame: ' + $1 + ', expr: ' + $2; }
    | CARD ID expr { $$ = 'frame: ' + $1 + ', id: ' + $3; }
    ;

background_object_bare_clause
    : navigation_pointer BACKGROUND { $$ = 'frame: ' + $2 + ', pointer: ' + $1; }
    | BACKGROUND expr { $$ = 'frame: ' + $1 + ', expr: ' + $2; }
    | BACKGROUND ID expr { $$ = 'frame: ' + $1 + ', id: ' + $3; }
    ;

stack_object_clause
    : navigation_pointer STACK { $$ = 'frame: ' + $2 + ', pointer: ' + $1; }
    | STACK expr { $$ = 'frame: ' + $1 + ', expr: ' + $2; }
    | STACK ID expr { $$ = 'frame: ' + $1 + ', id: ' + $3; }
    ;

background_object_clause
    : background_object_bare_clause %prec LOWER_PREC { $$ = $1; }
    | background_object_bare_clause OF stack_object_clause %prec LOWER_PREC { $$ = $1 + ', stack: { ' + $3 + ' }'; }
    ;

card_object_clause
    : card_object_bare_clause %prec LOWER_PREC { $$ = $1; }
    | card_object_bare_clause OF background_object_clause %prec LOWER_PREC { $$ = $1 + ', background: { ' + $3 + ' }'; }
    ;

frame_object_clause
    : card_object_clause
    | background_object_clause
    | stack_object_clause
    ;


// button related build-up
button_object_bare_clause
    : BUTTON expr { $$ = 'part: ' + $1 + ', expr: ' + $2; }
    | BUTTON ID expr { $$ = 'part: ' + $1 + ', id: ' + $3; }
    ;

button_object_owner_clause
    : frame_object BUTTON expr { $$ = 'part: ' + $2 + ', expr: ' + $3 + ', owner: ' + $1; }
    | frame_object BUTTON ID expr { $$ = 'part: ' + $2 + ', id: ' + $4 + ', owner: ' + $1; }
    ;

button_object_of_frame_clause
    : button_object_bare_clause OF frame_object_clause { $$ = $1 + ', frame: { ' + $3 + ' }'; }
    ;

button_object_clause
    : button_object_bare_clause %prec LOWER_PREC
    | button_object_owner_clause
    | button_object_of_frame_clause
    ;

// field related build-up
field_object_clause
    : FIELD expr %prec LOWER_PREC { $$ = 'part: ' + $1 + ', expr: ' + $2; }
    | FIELD ID expr %prec LOWER_PREC { $$ = 'part: ' + $1 + ', id: ' + $3; }
    | CARD_FIELD expr { $$ = 'part: "field", expr: ' + $2 + ', owner: "card"'; }
    | BACKGROUND_FIELD expr { $$ = 'part: "field", expr: ' + $2 + ', owner: "background"'; }
    | STACK_FIELD expr { $$ = 'part: "field", expr: ' + $2 + ', owner: "stack"'; }
    | CARD_FIELD ID expr { $$ = 'part: "field", id: ' + $3 + ', owner: "card"'; }
    | BACKGROUND_FIELD ID expr { $$ = 'part: "field", id: ' + $3 + ', owner: "background"'; }
    | STACK_FIELD ID expr { $$ = 'part: "field", id: ' + $3 + ', owner: "stack'; }
    | FIELD expr OF frame_object_clause { $$ = 'part: ' + $1 + ', expr: ' + $2 + ', frame: { ' + $4 + ' }'; }
    | FIELD ID expr OF frame_object_clause { $$ = 'part: ' + $1 + ', id: ' + $3 + ', frame: { ' + $5 + ' }'; }
    ;

part_object_clause
    : button_object_clause
    | field_object_clause
    ;

object_clause
    : part_object_clause
    | frame_object_clause
    ;

//! todo: think of incorporating "menubar: {}" here (and remove it at caller)
menubar_clause
    : MENU expr %prec LOWER_PREC { $$ = 'menu: ' + $1 + ', expr: ' + $2; }
    | MENU ID expr { $$ = 'menu: ' + $1 + ', id: ' + $3; }
    ;

menuitem_clause
    : selecter_pointer MENU_ITEM OF menubar_clause { $$ = 'menu: ' + $2 + ', pointer: ' + $1 + ', menubar: { ' + $4 + ' }'; }
    | MENU_ITEM expr OF menubar_clause { $$ = 'menu: ' + $1 + ', expr: ' + $2 + ', menubar: { ' + $4 + ' }'; }
    | MENU_ITEM ID expr OF menubar_clause { $$ = 'menu: ' + $1 + ', id: ' + $3 + ', menubar: { ' + $5 + ' }'; }
    ;

// join all property expression here
property_expr
    : global_property { $$ = 'property: ' + $1 + ', scope: "global"'; }
    | THE global_property { $$ = 'property: ' + $2 + ', scope: "global"'; }
    | painting_property { $$ = 'property: ' + $1 + ', scope: "painting"'; }
    | THE painting_property { $$ = 'property: ' + $2 + ', scope: "painting"'; }
    | button_object_property OF button_object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    | field_object_property OF field_object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    | part_object_property OF part_object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    | frame_object_property OF frame_object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    | object_property OF object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    // fixme, find better way of expressing "me" of object running current script, and other redundant below list...
    | button_object_property OF ME { $$ = 'property: ' + $1 + ', scope: ' + $3; }
    | field_object_property OF ME { $$ = 'property: ' + $1 + ', scope: ' + $3; }
    | part_object_property OF ME { $$ = 'property: ' + $1 + ', scope: ' + $3; }
    | frame_object_property OF ME { $$ = 'property: ' + $1 + ', scope: ' + $3; }
    | object_property OF ME { $$ = 'property: ' + $1 + ', scope: ' + $3; }
    // menu related
    | menuitem_property OF menuitem_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    // list containing enabled property
    | enabled_property OF button_object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    | enabled_property OF ME { $$ = 'property: ' + $1 + ', scope: ' + $3; } // copy for button
    | enabled_property OF menuitem_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    | enabled_property OF menubar_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    // list containing visible property
    | visible_property OF part_object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    | visible_property OF ME { $$ = 'property: ' + $1 + ', scope: ' + $3; }
    | visible_property OF menubar_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    // list containing textStyle property
    | text_style_property OF part_object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    | text_style_property OF ME { $$ = 'property: ' + $1 + ', scope: ' + $3; }
    | text_style_property %prec LOWER_PREC { $$ = 'property: ' + $1 + ', scope: "painting"'; }
    | THE text_style_property { $$ = 'property: ' + $2 + ', scope: "painting"'; }
    | text_style_property OF menuitem_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    // list containing textAlign et. at property (menuItem is excluded.)
    | text_basic_property OF part_object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $3 + ' }'; }
    | text_basic_property OF ME { $$ = 'property: ' + $1 + ', scope: ' + $3; }
    | text_basic_property %prec LOWER_PREC { $$ = 'property: ' + $1 + ', scope: "painting"'; }
    | THE text_basic_property { $$ = 'property: ' + $2 + ', scope: "painting"'; }
    // list containing scriptingLanguage property
    | scripting_language_of object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $2 + ' }'; }
    | scripting_language_of ME { $$ = 'property: ' + $1 + ', scope: ' + $2; }
    // list containing name and id property
    | base_property_of object_clause { $$ = 'property: ' + $1 + ', scope: { ' + $2 + ' }'; }
    | base_property_of ME { $$ = 'property: ' + $1 + ', scope: ' + $2; } // copy for object
    | base_property_of menuitem_clause { $$ = 'property: ' + $1 + ', scope: { ' + $2 + ' }'; }
    | base_property_of menubar_clause { $$ = 'property: ' + $1 + ', scope: { ' + $2 + ' }'; }
    ;

// container related build-up
chunk_bare_clause
    : chunk expr OF { $$ = 'chunk: ' + $1 + ', at: ' + $2; }
    | chunk expr TO expr OF { $$ = 'chunk: ' + $1 + ', start: ' + $2 + ', end: ' + $4; }
    | selecter_pointer chunk OF { $$ = 'chunk: ' + $2 + ', pointer: ' + $1; }
    ;

chunk_clause
    : chunk_bare_clause { $$ = $1; }
    | chunk_clause chunk_bare_clause { $$ = $2 + ', inner: {' + $1 + '}'; }
    ;

// join all container expression here
container_expr
    : system_container { $$ = 'container: ' + $1; }
    | field_object_clause { $$ = 'container: "field", field: { ' + $1 + ' }'; }
    | chunk_clause field_object_clause { $$ = 'container: "field", field: { ' + $2 + ', chunk: { ' + $1 + ' } }'; }
    | menubar_clause { $$ = 'container: "menuBar", menubar: {' + $1 + ' }'; }
    | menuitem_clause { $$ = 'container: "menuItem", menuItem: {' + $1 + ' }'; }
    ;

modifier_key_list
    : modifier_key
    | modifier_key_list ',' modifier_key { $$ = $1 + ',' + $3; }
    ;

on_off_switch
    : ON
    | OFF
    ;

// expand 'to card' visual_image here due to conflict in parsing grammer
visual_effect_clause
    : visual_effect { $$ = 'effect: ' + $1; }
    | visual_effect visual_speed { $$ = 'effect: ' + $1 + ', speed: ' + $2; }
    | visual_effect visual_image { $$ = 'effect: ' + $1 + ', image: ' + $2; }
    | visual_effect TO CARD { $$ = 'effect: ' + $1 + ', image: "card"'; }
    | visual_effect visual_speed visual_image{ $$ = 'effect: ' + $1 + ', speed: ' + $2 + ', image: ' + $3; }
    | visual_effect visual_speed TO CARD { $$ = 'effect: ' + $1 + ', speed: ' + $2 + ', image: "card"'; }
    ;

/*
 * command list
 */
command
    : navigation_command
    | action_command
    | sound_command
    | arithmatic_command
    | search_command
    | display_command
    | object_manipulation_command
    | file_manipulation_command
    | menu_command
    | printing_command
    | script_command
    | window_manipulation_command
    | key_manipulation_command
    ;

navigation_command
    : GO frame_object_clause { $$ = 'WcInterpreter.commands.go({ ' + $2 + ' });'; }
    | PUSH frame_object_clause { $$ = 'WcInterpreter.commands.push({ ' + $2 + ' });'; }
    | POP CARD { $$ = 'WcInterpreter.commands.pop();'; }
    | POP CARD preposition_pointer container_expr 
        {
            var param = '{ pos: ' + $3 + ', ' + $4 + ' }';
            $$ = 'WcInterpreter.commands.pop(' + param + ');';
        }
    | HELP { $$ = 'WcInterpreter.commands.help();'; }
    | OPEN STRING_LITERAL { $$ = 'WcInterpreter.commands.open({ app: ' + $2 + ' });'; }
    | OPEN STRING_LITERAL WITH STRING_LITERAL { $$ = 'WcInterpreter.commands.open({ app: ' + $4 + ' , file: ' + $2 + ' });'; }
    | CLOSE STRING_LITERAL WITH STRING_LITERAL { $$ = 'WcInterpreter.commands.close({ app: ' + $4 + ' , file: ' + $2 + ' });'; }
    | LOCK_RECENT_CMD { $$ = 'WcInterpreter.commands.lockRecent();'; }
    | UNLOCK_RECENT_CMD { $$ = 'WcInterpreter.commands.unlockRecent();'; }
    | ANSWER_PROGRAM STRING_LITERAL { $$ = 'WcInterpreter.commands.answerProgram({ text: ' + $2 + ' });'; }
    | ARROW_KEY arrow_pointer { $$ = 'WcInterpreter.commands.arrowKey({ arrow: ' + $2 + ' });'; }
    ;

action_command
    : PUT expr // put into message box by default
        {
            var param = '{ expr: ' + $2 + ', pos: "into", container: "message box" }';
            $$ = 'WcInterpreter.commands.put(' + param + ');';
        }
    | PUT expr preposition_pointer variable_reference 
        {
            parseHelper.registerVariables($4);
            var param = '{ expr: ' + $2 + ', pos: ' + $3 + ', var: ' + $4 + ' }';
            $$ = $4 + ' = WcInterpreter.commands.put(' + param + ');';
        }
    | PUT expr preposition_pointer container_expr
        {
            var param = '{ expr: ' + $2 + ', pos: ' + $3 + ', ' + $4 + ' }';
            $$ = 'WcInterpreter.commands.put(' + param + ');';
        }
// use equivalent 'put expr into it'. GET will only focus on property
//    | GET expr %prec LOWER_PREC { $$ = 'WcInterpreter.commands.get({ ' + $2 + ' });'; }
    | DELETE part_object_clause { $$ = 'WcInterpreter.commands.delete({ ' + $2 + ' });'; }
    | ENABLE button_object_clause { $$ = 'WcInterpreter.commands.enable({ ' + $2 + ' });'; }
    | DISABLE button_object_clause { $$ = 'WcInterpreter.commands.disable({ ' + $2 + ' });'; }
    | SELECT part_object_clause { $$ = 'WcInterpreter.commands.selectObject({ ' + $2 + ' });'; }
    | SELECT chunk_clause field_object_clause { $$ = 'WcInterpreter.commands.selectText({ ' + $3 + ', chunk: { ' + $2 + ' } });'; }
    | SELECT BEFORE chunk_clause field_object_clause { $$ = 'WcInterpreter.commands.selectText({ ' + $4 + ', chunk: { ' + $3 + ' }, pos: ' + $2 + ' });'; }
    | SELECT AFTER chunk_clause field_object_clause { $$ = 'WcInterpreter.commands.selectText({ ' + $4 + ', chunk: {' + $3 + ' }, pos: ' + $2 + ' });'; }
    | SELECT TEXT OF field_object_clause { $$ = 'WcInterpreter.commands.selectText({ ' + $4 + ' });'; }
    | DIAL expr { $$ = 'WcInterpreter.commands.dial({ number: ' + $2 + ' });'; } // obsolete...
    | CHOOSE tool_type { $$ = 'WcInterpreter.commands.choose({ tool: ' + $2 + ' });'; }
    | CHOOSE TOOL expr { $$ = 'WcInterpreter.commands.choose({ toolId: ' + $3 + ' });'; }
    | CLICK AT expr { $$ = 'WcInterpreter.commands.click({ expr: ' + $3 + ' });'; }
    | CLICK AT expr WITH modifier_key_list { $$ = 'WcInterpreter.commands.click({ expr: ' + $3 + ', keys: [' + $5 + '] });'; }
    | CLICK AT coordinate { $$ = 'WcInterpreter.commands.click({ loc: ' + $3 + ' });'; }
    | CLICK AT coordinate WITH modifier_key_list { $$ = 'WcInterpreter.commands.click({ loc: ' + $3 + ', keys: [' + $5 + '] });'; }
//    | CLICK AT expr ',' expr { $$ = 'WcInterpreter.commands.click({ x: ' + $3 + ', y: ' + $5 + ' });'; }
//    | CLICK AT expr ',' expr WITH modifier_key_list { $$ = 'WcInterpreter.commands.click({ x: ' + $3 + ', y: ' + $5 + ', keys: [' + $7 + '] });'; }
    | DRAG FROM expr TO expr { $$ = 'WcInterpreter.commands.drag({ expr1: ' + $3 + ', expr2: ' + $5 + ' });'; }
    | DRAG FROM expr TO expr WITH modifier_key_list { $$ = 'WcInterpreter.commands.drag({ expr1: ' + $3 + ', expr2: ' + $5 + ', keys: [' + $7 + '] });'; }
    | DRAG FROM coordinate TO coordinate { $$ = 'WcInterpreter.commands.drag({ loc1: ' + $3 + ', loc2: ' + $5 + ' });'; }
    | DRAG FROM coordinate TO coordinate WITH modifier_key_list { $$ = 'WcInterpreter.commands.drag({ loc1: ' + $3 + ', loc2: ' + $5 + ', keys: [' + $7 + '] });'; }
    | DRAG FROM expr TO coordinate { $$ = 'WcInterpreter.commands.drag({ expr1: ' + $3 + ', loc2: ' + $5 + ' });'; }
    | DRAG FROM expr TO coordinate WITH modifier_key_list { $$ = 'WcInterpreter.commands.drag({ expr1: ' + $3 + ', loc2: ' + $5 + ', keys: [' + $7 + '] });'; }
    | DRAG FROM coordinate TO expr { $$ = 'WcInterpreter.commands.drag({ loc1: ' + $3 + ', expr2: ' + $5 + ' });'; }
    | DRAG FROM coordinate TO expr WITH modifier_key_list { $$ = 'WcInterpreter.commands.drag({ loc1: ' + $3 + ', expr2: ' + $5 + ', keys: [' + $7 + '] });'; }
//    | DRAG FROM expr ',' expr TO expr ',' expr { $$ = 'WcInterpreter.commands.drag({ x0: ' + $3 + ', y0: ' + $5 + ', x1: ' + $7 + ', y1: ' + $9 + ' });'; }
//    | DRAG FROM expr ',' expr TO expr ',' expr WITH modifier_key_list { $$ = 'WcInterpreter.commands.drag({ x0: ' + $3 + ', y0: ' + $5 + ', x1: ' + $7 + ', y1: ' + $9 + ', keys: [' + $11 + '] });'; }
    | TYPE expr { $$ = 'WcInterpreter.commands.type({ text: ' + $2 + ' });'; }
    | TYPE expr WITH modifier_key_list { $$ = 'WcInterpreter.commands.type({ text: ' + $2 + ', keys: [' + $4 + '] });'; }
    ;

sound_command
    : BEEP { $$ = 'WcInterpreter.commands.beep({ count: 1 });'; }
    | BEEP expr { $$ = 'WcInterpreter.commands.beep({ count: ' + $2 + ' });'; }
    | PLAY expr { $$ = 'WcInterpreter.commands.play({ sound: ' + $2 + ' });'; }
    | PLAY expr ',' expr { $$ = 'WcInterpreter.commands.play({ sound: ' + $2 + ', note: ' + $4 + ' });'; }
    | PLAY expr ',' TEMPO expr { $$ = 'WcInterpreter.commands.play({ sound: ' + $2 + ', tempo: ' + $5 + ' });'; }
    | PLAY expr ',' TEMPO expr ',' expr { $$ = 'WcInterpreter.commands.play({ sound: ' + $2 + ', note: ' + $7 + ', tempo: ' + $5 + ' });'; }
    | PLAY_STOP { $$ = 'WcInterpreter.commands.playStop();'; } // stopPlay to have integrity?
    | STOP_SOUND { $$ = 'WcInterpreter.commands.stopSound();'; } // or soundStup to have integrity?
    | SPEAK expr WITH builtin_voice { $$ = 'WcInterpreter.commands.speak({ text: ' + $2 + ', voice: ' + $4 + ' });'; }
    | SPEAK expr WITH VOICE expr { $$ = 'WcInterpreter.commands.speak({ text: ' + $2 + ', voice: ' + $5 + ' });'; }
    | STOP_SPEECH { $$ = 'WcInterpreter.commands.stopSpeech();'; } // or speechStop to have integrity?
    | DEBUG_SOUND on_off_switch { $$ = 'WcInterpreter.commands.debugSound({ switch: ' + $2 + ' });'; }
    ;

arithmatic_command
    : ADD expr TO container_expr { $$ = 'WcInterpreter.commands.add({ dest: { ' + $4 + ' }, value: ' + $2 + ' });'; }
    | SUBTRACT expr FROM container_expr { $$ = 'WcInterpreter.commands.subtract({ dest: { ' + $4 + ' }, value: ' + $2 + ' });'; }
    | MULTIPLY container_expr BY expr { $$ = 'WcInterpreter.commands.multiply({ dest: { ' + $2 + ' }, value: ' + $4 + ' });'; }
    | DIVIDE container_expr BY expr { $$ = 'WcInterpreter.commands.divide({ dest: { ' + $2 + ' }, value: ' + $4 + ' });'; }
    | ADD expr TO variable_reference { $$ = $4 + ' += ' + $2 + ';'; }
    | SUBTRACT expr FROM variable_reference { $$ = $4 + ' -= ' + $2 + ';'; }
    | MULTIPLY variable_reference BY expr { $$ = $2 + ' *= ' + $4 + ';'; }
    | DIVIDE variable_reference BY expr { $$ = $2 + ' /= ' + $4 + ';'; }
    ;

search_command
    : FIND expr { $$ = 'WcInterpreter.commands.find({ expr: ' + $2 + ' });'; }
    | FIND_WHOLE expr { $$ = 'WcInterpreter.commands.findWhole({ expr: ' + $2 + ' });'; }
    | FIND_WORD expr { $$ = 'WcInterpreter.commands.findWord({ expr: ' + $2 + ' });'; }
    | FIND_CHARS expr { $$ = 'WcInterpreter.commands.findChars({ expr: ' + $2 + ' });'; }
    | FIND_STRING expr { $$ = 'WcInterpreter.commands.findString({ expr: ' + $2 + ' });'; }
    | SORT_CARDS TEXT BY expr { $$ = 'WcInterpreter.commands.sortCards({ expr: ' + $4 + ' });'; }
    | SORT_ITEMS OF container_expr TEXT BY expr { $$ = 'WcInterpreter.commands.sortItems({ expr: ' + $2 + ', ' + $3 + ' });'; }
    | SORT_LINES OF container_expr TEXT BY expr { $$ = 'WcInterpreter.commands.sortLines({ expr: ' + $2 + ', ' + $3 + ' });'; }
    | MARK frame_object_clause { $$ = 'WcInterpreter.commands.mark({ ' + $2 + ' });'; } // force frame object to only card
    | MARK_CARDS_WHERE expr { $$ = 'WcInterpreter.commands.markCardsWhere({ expr: ' + $2 + ' });'; }
    | MARK_CARDS_BY_FINDING expr { $$ = 'WcInterpreter.commands.markCardsByFinding({ expr: ' + $2 + ' });'; }
    | MARK_ALL_CARDS { $$ = 'WcInterpreter.commands.markAllCards();'; }
    | UNMARK frame_object_clause { $$ = 'WcInterpreter.commands.unmark({ ' + $2 + ' });'; } // force frame object to only card
    | UNMARK_CARDS_WHERE expr { $$ = 'WcInterpreter.commands.unmarkCardsWhere({ expr: ' + $2 + ' });'; }
    | UNMARK_CARDS_BY_FINDING expr { $$ = 'WcInterpreter.commands.unmarkCardsByFinding({ expr: ' + $2 + ' });'; }
    | UNMARK_ALL_CARDS { $$ = 'WcInterpreter.commands.unmarkAllCards();'; }
    | GO_MARKED_CARD expr { $$ = 'WcInterpreter.commands.goMarkedCard({ expr: ' + $2 + ' });'; }
    ;

display_command
    : VISUAL visual_effect_clause { $$ = 'WcInterpreter.commands.visual({ ' + $2 + ' });'; }
    | FLASH { $$ = 'WcInterpreter.commands.flash({ count: 3 });'; }
    | FLASH expr { $$ = 'WcInterpreter.commands.flash({ count: ' + $2 + ' });'; }
    | ANSWER expr { $$ = 'WcInterpreter.commands.answer({ text: ' + $2 + ' });'; }
    // note: expr OR expr will reduce to expr. limit only to literal and var ref.
    | ANSWER expr WITH STRING_LITERAL { $$ = 'WcInterpreter.commands.answer({ text: ' + $2 + ', choices: [' + $4 + '] });'; }
    | ANSWER expr WITH STRING_LITERAL OR STRING_LITERAL { $$ = 'WcInterpreter.commands.answer({ text: ' + $2 + ', choices: [' + $4 + ', ' + $6 + '] });'; }
    | ANSWER expr WITH STRING_LITERAL OR STRING_LITERAL OR STRING_LITERAL { $$ = 'WcInterpreter.commands.answer({ text: ' + $2 + ', choices: [' + $4 + ', ' + $6 + ', ' + $8 + '] });'; }
    | ANSWER expr WITH variable_reference { $$ = 'WcInterpreter.commands.answer({ text: ' + $2 + ', choices: [' + $4 + '] });'; }
    | ANSWER expr WITH variable_reference OR variable_reference { $$ = 'WcInterpreter.commands.answer({ text: ' + $2 + ', choices: [' + $4 + ', ' + $6 + '] });'; }
    | ANSWER expr WITH variable_reference OR variable_reference OR variable_reference { $$ = 'WcInterpreter.commands.answer({ text: ' + $2 + ', choices: [' + $4 + ', ' + $6 + ', ' + $8 + '] });'; }
    | ASK expr { $$ = 'WcInterpreter.commands.ask({ text: ' + $2 + ' });'; }
    | ASK expr WITH expr { $$ = 'WcInterpreter.commands.ask({ text: ' + $2 + ', default: ' + $4 + ' });'; }
    | ASK_PASSWORD expr { $$ = 'WcInterpreter.commands.askPassword({ text: ' + $2 + ' });'; }
    | ASK_PASSWORD CLEAR expr { $$ = 'WcInterpreter.commands.askPassword({ text: ' + $3 + ', clear: true });'; }
    | ASK_PASSWORD expr WITH expr { $$ = 'WcInterpreter.commands.askPassword({ text: ' + $2 + ', default: ' + $4 + ' });'; }
    | ASK_PASSWORD CLEAR expr WITH expr { $$ = 'WcInterpreter.commands.askPassword({ text: ' + $3 + ', default: ' + $5 + ', clear: true });'; }
    | LOCK_SCREEN { $$ = 'WcInterpreter.commands.lockScreen();'; }
    | UNLOCK_SCREEN { $$ = 'WcInterpreter.commands.unlockScreen();'; }
    | UNLOCK_SCREEN WITH visual_effect_clause { $$ = 'WcInterpreter.commands.unlockScreen({ ' + $3 + ' });'; }
    | UNLOCK_SCREEN WITH VISUAL visual_effect_clause { $$ = 'WcInterpreter.commands.unlockScreen({ ' + $4 + ' });'; }
//    | PALETTE expr {} // will not implement
//    | PICTURE expr {} // will not implement
    ;
    
object_manipulation_command
//    : GET expr { $$ = 'WcInterpreter.commands.get({ ' + $2 + ' });'; } // comment out this if GET also container, etc.
    : GET property_expr { $$ = 'WcInterpreter.commands.get({ ' + $2 + ' });'; }
    | SET property_expr TO expr { $$ = 'WcInterpreter.commands.set({ ' + $2 + ', value: ' + $4 + ' });'; }
    | SET property_expr TO coordinate { $$ = 'WcInterpreter.commands.set({ ' + $2 + ', loc: ' + $4 + ' });'; }
    | HIDE object_clause { $$ = 'WcInterpreter.commands.hide({ ' + $2 + ' });'; }
    | HIDE MENUBAR { $$ = 'WcInterpreter.commands.hide({ object: ' + $2 + ' });'; }
    | HIDE TITLEBAR { $$ = 'WcInterpreter.commands.hide({ object: ' + $2 + ' });'; }
    | HIDE MESSAGE_BOX { $$ = 'WcInterpreter.commands.hide({ object: ' + $2 + ' });'; }
    | HIDE PICTURE OF frame_object_clause { $$ = 'WcInterpreter.commands.hide({ ' + $4 + ' });'; }
    | SHOW object_clause { $$ = 'WcInterpreter.commands.show({ ' + $2 + ' });'; }
    | SHOW MENUBAR { $$ = 'WcInterpreter.commands.show({ object: ' + $2 + ' });'; }
    | SHOW TITLEBAR { $$ = 'WcInterpreter.commands.show({ object: ' + $2 + ' });'; }
    | SHOW MESSAGE_BOX { $$ = 'WcInterpreter.commands.show({ object: ' + $2 + ' });'; }
    | SHOW PICTURE OF frame_object_clause { $$ = 'WcInterpreter.commands.show({ ' + $4 + ' });'; }
//    | SHOW expr CARDS {} // will not implement.
//    | SHOW ALL CARDS {} // will not implement.
//    | HIDE_GROUPS {} // will not implement.
//    | SHOW_GROUPS {} // will not implement.
//    | EDIT_SCRIPT {} // will not implement.
    | RESET_PAINT { $$ = 'WcInterpreter.commands.resetPaint();'; }
//    | SELECT part_object_clause { $$ = 'WcInterpreter.commands.select({ ' + $2 + ' });'; } // moved to action_command
    | SELECT_EMPTY { $$ = 'WcInterpreter.commands.selectEmpty();'; }
    | SELECT_LINE expr OF part_object_clause { $$ = 'WcInterpreter.commands.selectLine({ at: ' + $2 + ', ' + $4 + ' });'; }
    | SELECT_LINE expr TO expr OF part_object_clause { $$ = 'WcInterpreter.commands.selectLine({ start: ' + $2 + ', end: ' + $4 + ', ' + $6 + ' });'; }
//    | CREATE_STACK STRING_LITERAL {} // will not implement.
//    | SAVE STACK expr AS expr {} // will not implement.
//    | COPY_TEMPLATE expr TO expr {} // will not implement.
    | ENTER_IN_FIELD { $$ = 'WcInterpreter.commands.enterInField();'; }
    ;

file_manipulation_command // will be obsoleted
    : OPEN_FILE STRING_LITERAL { $$ = 'WcInterpreter.commands.openFile({ file: ' + $2 + ' });'; }
    | CLOSE_FILE STRING_LITERAL { $$ = 'WcInterpreter.commands.closeFile({ file: ' + $2 + ' });'; }
    | ANSWER_FILE STRING_LITERAL { $$ = 'WcInterpreter.commands.answerFile({ file: ' + $2 + ' });'; }
    | ASK_FILE STRING_LITERAL { $$ = 'WcInterpreter.commands.askFile({ file: ' + $2 + ' });'; }
    | READ_FROM_FILE STRING_LITERAL FOR expr { $$ = 'WcInterpreter.commands.read({ file: ' + $2 + ', bytes: ' + $4 + ' });'; }
    | WRITE expr TO FILE STRING_LITERAL { $$ = 'WcInterpreter.commands.write({ file: ' + $5 + ', data: ' + $2 + ' });'; }
    | PRINT container_expr { $$ = 'WcInterpreter.commands.print({ ' + $2 + ' });'; }
//    | IMPORT_PAINT {} // will not implement
//    | EXPORT_PAINT {} // will not implement
    ;

menu_command
    : DO_MENU expr { $$ = 'WcInterpreter.commands.doMenu({ expr: ' + $2 + ' });'; }
    | DO_MENU expr OF menubar_clause { $$ = 'WcInterpreter.commands.doMenu({ expr: ' + $2 + ', menubar: { ' + $4 + ' } });'; }
    | DO_MENU expr WITHOUT_DIALOG { $$ = 'WcInterpreter.commands.doMenu({ expr: ' + $2 + ', dialog: false });'; }
    | DO_MENU expr OF menubar_clause WITHOUT_DIALOG { $$ = 'WcInterpreter.commands.doMenu({ expr: ' + $2 + ', menubar: { ' + $4 + ' }, dialog: false });'; }
    | CREATE_MENU expr { $$ = 'WcInterpreter.commands.createMenu({ menuBar: ' + $2 + ' });'; }
//    | PUT {} // incorporated in action_command PUT where expr already contains menu container_expr
    | DELETE menuitem_clause { $$ = 'WcInterpreter.commands.delete({ ' + $2 + ' });'; }
    | DELETE menubar_clause { $$ = 'WcInterpreter.commands.delete({ ' + $2 + ' });'; }
    | RESET_MENUBAR { $$ = 'WcInterpreter.commands.resetMenubar();'; }
    | ENABLE menubar_clause { $$ = 'WcInterpreter.commands.enable({ ' + $2 + ' });'; }
    | ENABLE menuitem_clause { $$ = 'WcInterpreter.commands.enable({ ' + $2 + ' });'; }
    | DISABLE menubar_clause { $$ = 'WcInterpreter.commands.disable({ ' + $2 + ' });'; }
    | DISABLE menuitem_clause { $$ = 'WcInterpreter.commands.disable({ ' + $2 + ' });'; }
    ;

printing_command
    : OPEN_PRINTING { $$ = 'WcInterpreter.commands.openPrinting();'; }
    | OPEN_PRINTING WITH_DIALOG { $$ = 'WcInterpreter.commands.openPrinting({ dialog: true });'; }
    | OPEN_REPORT_PRINTING { $$ = 'WcInterpreter.commands.openReportPrinting();'; }
    | OPEN_REPORT_PRINTING WITH_DIALOG { $$ = 'WcInterpreter.commands.openReportPrinting({ dialog: true });'; }
    | CLOSE_PRINTING { $$ = 'WcInterpreter.commands.closePrinting();'; }
    | CLOSE_PRINTING WITH_DIALOG { $$ = 'WcInterpreter.commands.closePrinting({ dialog: true });'; }
    | PRINT_CARD expr { $$ = 'WcInterpreter.commands.printCard({ expr: ' + $2 + ' });'; }
    | PRINT expr CARDS  { $$ = 'WcInterpreter.commands.printCards({ expr: ' + $2 + ' });'; }
    | PRINT MARKED CARD { $$ = 'WcInterpreter.commands.printMarkedCard();'; }
    | PRINT MARKED CARDS { $$ = 'WcInterpreter.commands.printMarkedCard();'; }
    | RESET_PRINTING { $$ = 'WcInterpreter.commands.resetPrinting();'; }
    ;

script_command
    : WAIT expr SECONDS { $$ = 'WcInterpreter.commands.wait({ expr: ' + $2 + ', unit: ' + $3 + ' });'; }
    | WAIT expr TICKS { $$ = 'WcInterpreter.commands.wait({ expr: ' + $2 + ', unit: ' + $3 + ' });'; }
    | WAIT expr { $$ = 'WcInterpreter.commands.wait({ expr: ' + $2 + ', unit: "ticks" });'; }
    //! todo: revisit impl of wait until/while. think of using yield?
    // escape single and double quote in expr, like { constant: "down" }
    | WAIT UNTIL expr { $$ = 'WcInterpreter.commands.wait({ expr: Function("return ' + $3.replace(/"/gm,'\\\"').replace(/'/gm,"\\\'") + ';"), condition: ' + $2 + ' });'; }
    | WAIT WHILE expr { $$ = 'WcInterpreter.commands.wait({ expr: Function("return ' + $3.replace(/"/gm,'\\\"').replace(/'/gm,"\\\'") + ';"), condition: ' + $2 + ' });'; }
    | EXIT_TO_HYPERCARD { $$ = 'WcInterpreter.commands.exitToHyperCard();'; } // or should move to keyword list?
    | LOCK_MESSAGES_CMD { $$ = 'WcInterpreter.commands.lockMessages();'; } // humm same as 'set lockMessages to true' but 2 ways to do...
    | UNLOCK_MESSAGES_CMD { $$ = 'WcInterpreter.commands.unlockMessages();'; }
    | LOCK_ERROR_DIALOGS_CMD { $$ = 'WcInterpreter.commands.lockErrorDialogs();'; }
    | UNLOCK_ERROR_DIALOGS_CMD { $$ = 'WcInterpreter.commands.unlockErrorDialogs();'; }
    | START_USING expr { $$ = 'WcInterpreter.commands.startUsing({ expr: ' + $2 + ' });'; }
    | STOP_USING expr { $$ = 'WcInterpreter.commands.stopUsing({ expr: ' + $2 + ' });'; }
    | DEBUG_CHECKPOINT { $$ = 'WcInterpreter.commands.debugCheckpoint();'; }
    | MAGIC { $$ = 'WcInterpreter.commands.magic();'; }
    // move PASS, SEND, DO to keyword list
    ;

window_manipulation_command
    : CLOSE_WINDOW expr { $$ = 'WcInterpreter.commands.closeWindow({ expr: ' + $2 + ' });'; }
    ;

key_manipulation_command
    : COMMAND_KEY_DOWN expr { $$ = 'WcInterpreter.commands.commandKeyDown({ expr: ' + $2 + ' });'; }
    | CONTROL_KEY expr { $$ = 'WcInterpreter.commands.controlKey({ expr: ' + $2 + ' });'; }
    | ENTER_KEY { $$ = 'WcInterpreter.commands.enterKey();'; }
    | RETURN_KEY { $$ = 'WcInterpreter.commands.returnKey();'; }
    | TAB_KEY { $$ = 'WcInterpreter.commands.tabKey();'; }
    ;


keyword
    : PASS { $$ = 'WcInterpreter.commands.pass();'; } // not really a command...
    | if_frame
    | RETURN { $$ = 'return;'; }
    | RETURN expr { $$ = 'return ' + $2 + ';'; }
    | repeat_frame
    | EXIT_REPEAT { $$ = 'break;'; }
    | NEXT REPEAT { $$ = 'WcInterpreter.loopCounter.increment(1);\n' + 'continue;'; }
    | DO container_expr { $$ = 'WcInterpreter.commands.do({ ' + $2 + ' });'; }
    | DO variable_reference { $$ = 'WcInterpreter.commands.do({ variable: ' + $2 + ' });'; }
    | DO STRING_LITERAL { $$ = 'WcInterpreter.commands.do({ string: ' + $2 + ' });'; }
    | SEND system_message TO object_clause { //! todo: handle "send xxx to HyperCard"
        $$ = 'WcInterpreter.commands.send({ message: "' + $2 + '", object: {' + $4 + ' } })';
      }
    | GLOBAL variables { $$ = ''; parseHelper.registerVariables($2, true); }
    ;

if_frame
    : if_block
//      else_ifs_block
      else_if_block
      else_block
      end_if_block { $$ = $1 + $2 + $3 + $4; }
    ;

if_block
    : IF expr THEN
        block
        {
            var body = $4.replace(/\n$/,'').replace(/\n/gm, '\n\t').replace(/^/, '\n\t');
            $$ = 'if (' + $2 + ') {' + body;
        }
    ;

else_block
    : /* allow empty else */ { $$ = ''; }
    | ELSE
        block
        {
            var body = $2.replace(/\n$/,'').replace(/\n/gm, '\n\t').replace(/^/, '\n\t');
            $$ = '\n} else {' + body;
        }
    ;

else_if_block
    : /* allow empty else if */ { $$ = ''; }
    | ELSE_IF expr THEN
//    : ELSE_IF expr THEN
        block
        {
            var body = $4.replace(/\n$/,'').replace(/\n/gm, '\n\t').replace(/^/, '\n\t');
            $$ = '\n} else if (' + $2 + ') {' + body;
        }
    ;

else_ifs_block
    : /* allow empty else if */ { $$ = ''; }
    | else_if_block { $$ = $1; }
    | else_ifs_block else_if_block { $$ = $1 + $2; }
    ;

end_if_block
    : END IF { $$ = '\n}'; }
    ;

repeat_frame
    : repeat_header
        block
      END REPEAT {
            var body = $2.replace(/\n$/,'').replace(/\n/gm, '\n\t').replace(/^/, '\n\t');
            $$ = 'WcInterpreter.loopCounter.push(0);\n'
                 + $1
                 + body + '\n'
                 + '\t' + 'WcInterpreter.loopCounter.increment(1);\n'
                 + '}\n'
                 + 'WcInterpreter.loopCounter.pop();\n';
      }
    ;

repeat_header
    : REPEAT EOL { $$ = 'while (true) {'; }
    | REPEAT FOREVER EOL { $$ = 'while (true) {'; }
    | REPEAT UNTIL expr EOL { $$ = 'while ( !(' + $3 + ') ) {'; }
    | REPEAT WHILE expr EOL { $$ = 'while (' + $3 + ') {'; }
    | REPEAT expr TIMES EOL { $$ = 'while (WcInterpreter.loopCounter.value() < (' + $2 + ') ) {'; }
    | REPEAT WITH variable_reference EQUAL expr TO expr EOL {
        $$ = 'for (' + $3 + ' = ' + $5 + '; '
           + $3 + ' <= ' + $7 + '; '
           + $3 + ' += 1) {';
      }
    | REPEAT WITH variable_reference EQUAL expr DOWN_TO expr EOL {
        $$ = 'for (' + $3 + ' = ' + $5 + '; '
           + $3 + ' >= ' + $7 + '; '
           + $3 + ' -= 1) {';
      }
    ;

builtin_functions
    : THE_DATE { $$ = 'WcInterpreter.builtins.date()'; }
    | THE_TIME { $$ = 'WcInterpreter.builtins.time()'; }
    | THE_SECONDS { $$ = 'WcInterpreter.builtins.seconds()'; }
    | THE_TICKS { $$ = 'WcInterpreter.builtins.ticks()'; }
    | THE_MOUSE_H { $$ = 'WcInterpreter.builtins.mouseH()'; }
    | THE_MOUSE_V { $$ = 'WcInterpreter.builtins.mouseV()'; }
    | THE_MOUSE_LOC { $$ = 'WcInterpreter.builtins.mouseLoc()'; }
    | chunk_clause THE_MOUSE_LOC { $$ = 'WcInterpreter.builtins.mouseLoc({ chunk: { ' + $1 + ' } })'; }
    | THE_COMMAND_KEY { $$ = 'WcInterpreter.builtins.commandKey()'; }
    | THE_OPTION_KEY { $$ = 'WcInterpreter.builtins.optionKey()'; }
    | THE_SHIFT_KEY { $$ = 'WcInterpreter.builtins.shiftKey()'; }
    | THE_MOUSE { $$ = 'WcInterpreter.builtins.mouse()'; }
    | THE_MOUSE_CLICK { $$ = 'WcInterpreter.builtins.mouseClick()'; }
    | THE_CLICK_H { $$ = 'WcInterpreter.builtins.clickH()'; }
    | THE_CLICK_V { $$ = 'WcInterpreter.builtins.clickV()'; }
    | THE_CLICK_LOC { $$ = 'WcInterpreter.builtins.clickLoc()'; }
    | chunk_clause THE_CLICK_LOC { $$ = 'WcInterpreter.builtins.clickLoc({ chunk: { ' + $1 + ' } })'; }
    | THE_LENGTH_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.length({ expr: ' + $2 + ' })'; }
    | THE_CLICK_CHUNK { $$ = 'WcInterpreter.builtins.clickChunk()'; }
    | THE_CLICK_LINE { $$ = 'WcInterpreter.builtins.clickLine()'; }
    | THE_CLICK_TEXT { $$ = 'WcInterpreter.builtins.clickText()'; }
    | THE_SELECTED_TEXT { $$ = 'WcInterpreter.builtins.selectedText()'; }
    | THE_SELECTED_CHUNK { $$ = 'WcInterpreter.builtins.selectedChunk()'; }
    | THE_SELECTED_LINE { $$ = 'WcInterpreter.builtins.selectedLine()'; }
    | THE_SELECTED_FIELD { $$ = 'WcInterpreter.builtins.selectedField()'; }
    | THE_SELECTED_LOC { $$ = 'WcInterpreter.builtins.selectedLoc()'; }
    | THE_SELECTED_LINE_OF part_object_clause { $$ = 'WcInterpreter.builtins.selectedLineOf({ ' + $2 + ' })'; }
    | THE_FOUND_TEXT { $$ = 'WcInterpreter.builtins.foundText()'; }
    | THE_FOUND_CHUNK { $$ = 'WcInterpreter.builtins.foundChunk()'; }
    | THE_FOUND_LINE { $$ = 'WcInterpreter.builtins.foundLine()'; }
    | THE_FOUND_FIELD { $$ = 'WcInterpreter.builtins.foundField()'; }
    | THE_CHAR_TO_NUM_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.charToNum({ expr: ' + $2 + ' })'; }
    | THE_NUM_TO_CHAR_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.numToChar({ expr: ' + $2 + ' })'; }
    | THE_OFFSET_OF expr IN expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.offset({ needle: ' + $2 + ', haystack: ' + $4 + ' })'; }
    | THE_RANDOM_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.random({ expr: ' + $2 + ' })'; }
    | THE_SUM_OF arguments %prec LOWEST_PRIO { $$ = 'WcInterpreter.builtins.sum(' + $2 + ')'; }
    | THE_VALUE_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.value({ expr: ' + $2 + ' })'; }
    | THE_ABS_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.abs({ expr: ' + $2 + ' })'; }
    | THE_ANNUITY_OF coordinate %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.annuity({ratePeriods: ' + $2 + ' })'; }
//    | THE_ANNUITY_OF expr ',' expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.annuity({rate : ' + $2 + ', periods: ' + $4 + ' })'; } // conflict, IS_WITHIN
    | THE_ATAN_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.atan({ expr: ' + $2 + ' })'; }
    | THE_AVERAGE_OF arguments %prec LOWEST_PRIO { $$ = 'WcInterpreter.builtins.average(' + $2 + ')'; }
    | THE_COMPOUND_OF coordinate %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.compound({ratePeriods: ' + $2 + ' })'; }
//    | THE_COMPOUND_OF expr ',' expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.compound({rate : ' + $2 + ', periods: ' + $4 + ' })'; } // conflict, IS_WITHIN
    | THE_COS_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.cos({ expr: ' + $2 + ' })'; }
    | THE_EXP_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.exp({ expr: ' + $2 + ' })'; }
    | THE_EXP1_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.exp1({ expr: ' + $2 + ' })'; }
    | THE_EXP2_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.exp2({ expr: ' + $2 + ' })'; }
    | THE_LN_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.ln({ expr: ' + $2 + ' })'; }
    | THE_LN1_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.ln1({ expr: ' + $2 + ' })'; }
    | THE_LN2_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.ln2({ expr: ' + $2 + ' })'; }
    | THE_LOG2_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.log2({ expr: ' + $2 + ' })'; }
    | THE_MAX_OF arguments %prec LOWEST_PRIO { $$ = 'WcInterpreter.builtins.max(' + $2 + ')'; }
    | THE_MIN_OF arguments %prec LOWEST_PRIO { $$ = 'WcInterpreter.builtins.min(' + $2 + ')'; }
    | THE_ROUND_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.round({ expr: ' + $2 + ' })'; }
    | THE_SIN_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.sin({ expr: ' + $2 + ' })'; }
    | THE_SQRT_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.sqrt({ expr: ' + $2 + ' })'; }
    | THE_TAN_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.tan({ expr: ' + $2 + ' })'; }
    | THE_TRUNC_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.trunc({ expr: ' + $2 + ' })'; }
    | THE_NUMBER_OF_BUTTONS { $$ = 'WcInterpreter.builtins.numberOfButtons()'; }
    | THE_NUMBER_OF_FIELDS { $$ = 'WcInterpreter.builtins.numberOfFields()'; }
    | THE_NUMBER_OF_BUTTONS_IN frame_object_clause { $$ = 'WcInterpreter.builtins.numberOfButtonsIn({ ' + $2 + '})'; }
    | THE_NUMBER_OF_FIELDS_IN frame_object_clause { $$ = 'WcInterpreter.builtins.numberOfFieldsIn({ ' + $2 + '})'; }
    | THE_NUMBER_OF_CHARS_IN container_expr { $$ = 'WcInterpreter.builtins.numberOfChars({ ' + $2 + ' })'; }
    | THE_NUMBER_OF_ITEMS_IN container_expr { $$ = 'WcInterpreter.builtins.numberOfItems({ ' + $2 + ' })'; }
    | THE_NUMBER_OF_LINES_IN container_expr { $$ = 'WcInterpreter.builtins.numberOfLines({ ' + $2 + ' })'; }
    | THE_NUMBER_OF_WORDS_IN container_expr { $$ = 'WcInterpreter.builtins.numberOfWords({ ' + $2 + ' })'; }
    | THE_NUMBER_OF_BACKGROUNDS { $$ = 'WcInterpreter.builtins.numberOfBackgrounds()'; }
    | THE_NUMBER_OF_CARDS { $$ = 'WcInterpreter.builtins.numberOfCards()'; }
    | THE_NUMBER_OF_CARDS_IN frame_object_clause { $$ = 'WcInterpreter.builtins.numberOfCardsIn({ ' + $2 + '})'; }
    | THE_NUMBER_OF_MARKED_CARDS { $$ = 'WcInterpreter.builtins.numberOfMarkedCards()'; }
    | THE_NUMBER_OF_MENUS { $$ = 'WcInterpreter.builtins.numberOfMenus()'; }
    | THE_NUMBER_OF_MENUITEMS_OF menubar_clause { $$ = 'WcInterpreter.builtins.numberOfMenuItems({ menubar: { ' + $2 + ' }})'; }
    | THE_NUMBER_OF_WINDOWS { $$ = 'WcInterpreter.builtins.numberOfWindows()'; }
    | THE_SOUND { $$ = 'WcInterpreter.builtins.sound()'; }
    | THE_TOOL { $$ = 'WcInterpreter.builtins.tool()'; }
    | THE_SYSTEM_VERSION { $$ = 'WcInterpreter.builtins.systemVersion()'; }
    | THE_VERSION { $$ = 'WcInterpreter.builtins.version()'; }
    | THE_VERSION_OF frame_object_clause { $$ = 'WcInterpreter.builtins.versionOf({ ' + $2 + '})'; }
    | THE_LONG_VERSION { $$ = 'WcInterpreter.builtins.longVersion()'; }
    | THE_LONG_VERSION_OF frame_object_clause { $$ = 'WcInterpreter.builtins.longVersionOf({ ' + $2 + '})'; }
    | THE_MENUS { $$ = 'WcInterpreter.builtins.menus()'; }
    | THE_SCREEN_RECT { $$ = 'WcInterpreter.builtins.screenRect()'; }
    | THE_STACKS { $$ = 'WcInterpreter.builtins.stacks()'; }
    | THE_WINDOWS { $$ = 'WcInterpreter.builtins.windows()'; }
    | THE_DISK_SPACE { $$ = 'WcInterpreter.builtins.diskSpace()'; }
    | THE_HEAP_SPACE { $$ = 'WcInterpreter.builtins.heapSpace()'; }
    | THE_STACK_SPACE { $$ = 'WcInterpreter.builtins.stackSpace()'; }
    | THE_SELECTED_BUTTON_OF_BACKGROUND_FAMILY expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.selectedButtonOfBgFamily({ expr: ' + $2 + ' })'; }
    | THE_SELECTED_BUTTON_OF_CARD_FAMILY expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.selectedButtonOfCardFamily({ expr: ' + $2 + ' })'; }
    | THE_PROGRAMS { $$ = 'WcInterpreter.builtins.programs()'; }
    | THE_SPEECH { $$ = 'WcInterpreter.builtins.speech()'; }
    | THE_VOICES { $$ = 'WcInterpreter.builtins.voices()'; }
    | THE_RESULT { $$ = 'WcInterpreter.builtins.result()'; }
    | THE_TARGET { $$ = 'WcInterpreter.builtins.target()'; }
    | THE_DESTINATION { $$ = 'WcInterpreter.builtins.destination()'; }
    | THE_PARAM_OF expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.paramOf({ expr: ' + $2 + ' })'; }
    | THE_PARAM_COUNT { $$ = 'WcInterpreter.builtins.paramCount()'; }
    | THE_PARAMS { $$ = 'WcInterpreter.builtins.params()'; }
    | chunk_clause THE_PARAMS { $$ = 'WcInterpreter.builtins.params({ chunk: { ' + $1 + ' } })'; }
    // some operators here
    | expr CONTAINS expr { $$ = 'WcInterpreter.builtins.contains({ needle: ' + $3 + ', haystack: ' + $1 + ' })'; }
    | expr IS_IN expr { $$ = 'WcInterpreter.builtins.contains({ needle: ' + $1 + ', haystack: ' + $3 + ' })'; }
    | expr IS_NOT_IN expr { $$ = '(! WcInterpreter.builtins.contains({ needle: ' + $1 + ', haystack: ' + $3 + ' }))'; }
    | expr IS_A expr  { $$ = 'WcInterpreter.builtins.isA({ expr1: ' + $1 + ', expr2: ' + $3 + ' })'; }
    | expr IS_NOT_A expr  { $$ = '(! WcInterpreter.builtins.isA({ expr1: ' + $1 + ', expr2: ' + $3 + ' }))'; }
    | expr IS_WITHIN expr { $$ = 'WcInterpreter.builtins.isWithin({ expr: ' + $1 + ', rect: ' + $3 + ' })'; }
    | expr IS_NOT_WITHIN expr { $$ = '(! WcInterpreter.builtins.isWithin({ expr: ' + $1 + ', rect: ' + $3 + ' }))'; }
    | coordinate IS_WITHIN expr { $$ = 'WcInterpreter.builtins.isWithin({ loc: ' + $1 + ', rect: ' + $3 + ' })'; }
    | coordinate IS_NOT_WITHIN expr { $$ = '(! WcInterpreter.builtins.isWithin({ loc: ' + $1 + ', rect: ' + $3 + ' }))'; }
//    | expr ',' expr IS_WITHIN expr { $$ = 'WcInterpreter.builtins.isWithin({ x: ' + $1 + ', y: ' + $3 + ', rect: ' + $5 + ' })'; } // conflict in grammer
//    | expr ',' expr IS_NOT_WITHIN expr { $$ = '(! WcInterpreter.builtins.isWithin({ x: ' + $1 + ', y: ' + $3 + ', rect: ' + $5 + ' }))'; } // conflict in grammer
    | expr OP_AMPAMP expr { $$ = 'WcInterpreter.builtins.concat({ str1: ' + $1 + ', str2: ' + $3 + ', space: true })'; }
    | expr OP_AMP expr { $$ = 'WcInterpreter.builtins.concat({ str1: ' + $1 + ', str2: ' + $3 + ', space: false })'; }
    | THERE_IS_A object_clause { $$ = 'WcInterpreter.builtins.thereIsA({ object: { ' + $2 + ' } })'; }
    | THERE_IS_NOT_A object_clause { $$ = '(! WcInterpreter.builtins.thereIsA({ object: { ' + $2 + ' } }))'; }
    ;

expr
    : NUMBER_LITERAL { $$ = Number($1); }
    | INTEGER_LITERAL { $$ = parseInt($1); }
    | STRING_LITERAL
    | constant { $$ = 'WcInterpreter.eval({ constant: ' + $1 + ' })'; }
    | property_expr { $$ = 'WcInterpreter.eval({ ' + $1 + ' })'; }
    | container_expr { $$ = 'WcInterpreter.eval({ ' + $1 + ' })'; }
    | builtin_functions
    | variable_reference
//    | chunk_clause expr %prec LOWER_PREC { $$ = 'WcInterpreter.builtins.chunkOfExpr({ chunk: { ' + $1 + ' }, expr: ' + $2 + ' })'; } // too broad. chunk itself has expr. expand
//    | chunk_clause builtin_functions { $$ = 'WcInterpreter.builtins.chunkOf({ chunk: { ' + $1 + ' }, expr: ' + $2 + ' })'; } // still too broad. expand inside builtin_functions
    | chunk_clause variable_reference { $$ = 'WcInterpreter.builtins.chunkOf({ chunk: { ' + $1 + ' }, expr: ' + $2 + ' })'; }
    | chunk_clause STRING_LITERAL { $$ = 'WcInterpreter.builtins.chunkOf({ chunk: { ' + $1 + ' }, expr: ' + $2 + ' })'; }
    | function_call
//    | expr ',' expr { $$ = $1 + ' , ' + $3; } // will cause 'expected identifier' error on runtime at args object creation (like {loc: 100,100})
    | expr AND expr { $$ = $1 + ' && ' + $3; }
    | expr OR expr { $$ = $1 + ' || ' + $3; } // note, conflict with "answer T with A or B"...
    | NOT expr { $$ = ' ! ' + $2; }
    | expr IS expr { $$ = $1 + ' == ' + $3; }
    | expr EQUAL expr { $$ = $1 + ' == ' + $3; }
    | expr IS_NOT expr { $$ = $1 + ' != ' + $3; }
    | expr LT expr { $$ = $1 + ' < ' + $3; }
    | expr GT expr { $$ = $1 + ' > ' + $3; }
    | expr LE expr { $$ = $1 + ' <= ' + $3; }
    | expr GE expr { $$ = $1 + ' >= ' + $3; }
    | expr '+' expr { $$ = $1 + ' + ' + $3; }
    | expr '-' expr { $$ = $1 + ' - ' + $3; }
    | expr '*' expr { $$ = $1 + ' * ' + $3; }
    | expr '/' expr { $$ = $1 + ' / ' + $3; }
    | expr DIV expr { $$ = $1 + ' / ' + $3; }
    | expr MOD expr { $$ = $1 + ' % ' + $3; }
    | '-' expr %prec UMINUS { $$ = '-' + $2; }
    | '(' expr ')' %prec HIGHEST_PRIO { $$ = '(' + $2 + ')'; }
    ;

variable_reference
    : IDENTIFIER {
        var result = _.find(parseHelper.regVars, function(r){ return r.name == $1; });
        if (result && result.global === true) {
            $$ = 'WcInterpreter.globals.' + $1;
        } else {
            $$ = $1;
        }
      }
    ;

function_call
//    : IDENTIFIER '(' arguments ')' { $$ = 'WcInterpreter.call(' + $1 + ',' + $3 + ')'; } // stop using empty rule
    : IDENTIFIER '(' ')' { $$ = 'WcInterpreter.call("' + $1 + '")'; }
    | IDENTIFIER '(' arguments ')' { $$ = 'WcInterpreter.call("' + $1 + '", ' + $3 + ')'; }
    ;

coordinate
    : expr ',' expr %prec LOWER_PREC { $$ = '{ x: ' + $1 + ', y: ' + $3 + ' }' }
    ;

arguments
//    : /* empty arguments */ { $$ = ''; }
    : expr %prec LOWEST_PRIO { $$ = $1; }
    | coordinate %prec LOWEST_PRIO { $$ = $1 + '.x, ' + $1 + '.y'; }
    | arguments ',' expr %prec LOWEST_PRIO { $$ = $1 + ',' + $3; }
    | arguments ',' coordinate %prec LOWEST_PRIO { $$ = $1 + ',' + $3 + '.x, ' + $3 + '.y'; }
    ;

variables
    : variable_reference { $$ = $1; }
    | variables ',' variable_reference { $$ = $1 + ',' + $3; }
    ;

%%

// ad hoc test impl. to be replaced.
var _ = require('underscore');
// import WcInterpreter from './interpreter.js'; // ! fixme, not working...
var parseHelper = {
    regVars: [],
    handlers: [],
};
parseHelper.registerVariables = function(namez, global) {
    var names = namez.split(",");
    for (i = 0; i < names.length; ++i) {
        var name = names[i];
        if (name.match("WcInterpreter.globals")) {
            continue;
        }
        var v = { name: name, global: global};
        if (global) {
            if (window.WcInterpreter !== undefined) {
                if (window.WcInterpreter.globals !== undefined) {
                    if (window.WcInterpreter.globals[name] === undefined) {
                        window.WcInterpreter.globals[name] = null; // create entry
                    }
                }
            }
        }
        var result = _.find(this.regVars, function(r){ return r.name == name; });
        if (!result) {
            this.regVars.push(v);
        } else if (global && (!result.global)) {
            result.global = global;
        }
    }
};
parseHelper.showVariables = function() {
    var locals = _.filter(this.regVars, function(r){ return r.global !== true;});
    var decl = "";
    locals = _.map(locals, function(r){ return r.name; });
    if (locals.length) {
        decl += "var " + locals.join(", ") + ";\n";
    }
    return decl;
}
parseHelper.clearVariables = function() {
    this.regVars.splice(0, this.regVars.length);
}
