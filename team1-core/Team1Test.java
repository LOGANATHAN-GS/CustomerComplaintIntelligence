package com.customercomplaint.core;

public class Team1Test {

    public static void main(String[] args) {
        String complaint =
                "My package is very late and the delivery is terrible.";

        String result =
                ComplaintAnalyzer.analyze(complaint);

        System.out.println(result);
    }
}