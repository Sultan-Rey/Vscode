class Solution {
    public int solution(String E, String L) {
        // write your code in Java SE 8
        int bill = 0;
        String[] timingEntry = new String[2];
        String[] timingOut = new String[2];
        timingEntry = E.split(":");
        timingOut = L.split(":");
        int entryHours = Integer.parseInt(timingEntry[0]);
        int entryMinutes = Integer.parseInt(timingEntry[1]);
        int outHours = Integer.parseInt(timingOut[0]);
        int outMinutes = Integer.parseInt(timingOut[1]);

        int hourPassed = outHours - entryHours;
        int minPassed =  outMinutes - entryMinutes;


        if((hourPassed == 0 && minPassed!=0) || (hourPassed == 1 &&minPassed == 0) ){
            bill = 5;
        }else if( hourPassed == 1 && minPassed != 0){
            bill = 9;
        }else if (hourPassed > 2){
            bill = 5 + (hourPassed * 4);
        }else if (hourPassed <=2 ){
            bill = 9;
        }

        
        return bill;
    }

    public static void main() {
       System.out.println(solution("10:42","11:42"));
    }

}

