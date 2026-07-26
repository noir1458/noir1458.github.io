---
title: 'Flutter 7주차 정리'
slug: flutter-week-07
description: '7주차 수업 Form, Gesture와 Animation'
publishedAt: '2024-10-14'
categories: Flutter
math: false
---

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: MyForm(),
    );
  }
}

class MyForm extends StatefulWidget {
  const MyForm({super.key});

  @override
  State<MyForm> createState() => _MyFormState();
}

class _MyFormState extends State<MyForm> {
  StudentResult studentResult = StudentResult(0, 0, 0, 0, true);
  final _formKey = GlobalKey<FormState>();
  // form 위젯, 그 아래 여러 input 들의 validation이 가능하게 하고
  // FormField에는 반드시 GlobalKey가 필요하다
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        key: _formKey,
        child: ListView(
          children: [
            TextFormField(
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Mid-term exam'
              ),
              validator: (value) { // 지금 넣은 텍스트가 어떤 조건을 만족하는지
                if (value == null || value.isEmpty) { // 비어있다
                  return 'Insert some texts';
                } else if (int.tryParse(value)==null) { // int로 parsing 안됨
                  return 'Insert some integer';
                }
                return null;
              },
              onSaved: (value) {
                studentResult.midTermExam = int.parse(value!);
              },
            ),
            const SizedBox(
              height: 20,
            ),
            TextFormField(
              decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Final exam'
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Insert some texts';
                } else if (int.tryParse(value)==null) {
                  return 'Insert some integer';
                }
                return null;
              },
              onSaved: (value) {
                studentResult.finalTermExam = int.parse(value!);
              },
            ),
            const SizedBox(
              height: 20,
            ),
            DropdownButtonFormField(
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Additional Point',
              ),
              value: studentResult.additionalPoint,
              items: List.generate(11, (i){
                if (i==0){
                  return const DropdownMenuItem(
                    value: 0,
                    child: Text('Choose the additional Point'),
                  );
                }
                return DropdownMenuItem(
                  value: i,
                  child: Text('${i} point'),
                );
              }),
              onChanged: (value) {
                setState(() {
                  studentResult.additionalPoint = value!;
                });
              },
              validator: (value) {
                if (value == 0) { // 선택하지 않은 상태라면...
                  return 'Please select the point';
                }
                return null;
              },
            ),
            SizedBox(
              height: 20,
            ),
            Column(
              children: [
                RadioListTile(
                  title: Text('Team leader (+10)'),
                  value: 10,
                  groupValue: studentResult.teamLeaderPoint,
                  onChanged: (value) {
                    setState(() {
                      studentResult.teamLeaderPoint = value!;
                    });
                  },
                ),
                RadioListTile(
                  title: Text('Team Member'),
                  value: 0,
                  groupValue: studentResult.teamLeaderPoint,
                  onChanged: (value) {
                    setState(() {
                      studentResult.teamLeaderPoint = value!;
                    });
                  },
                ),
                SizedBox(
                  height: 20,
                ),
                CheckboxListTile(
                  title: Text('Absence less than 4'),
                  value: studentResult.attendance,
                  onChanged: (value) {
                    setState(() {
                      studentResult.attendance = value!;
                    });
                  },
                )
              ],
            ),
            SizedBox(
              height: 20,
            ),
            ElevatedButton(
              child: const Text('Enter'),
              onPressed: () {
                setState(() {
                  if (_formKey.currentState!.validate()) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                        content: Text('Processing data'),
                    ));
                    _formKey.currentState!.save();
                    print(studentResult);
                  }
                });
              },
            )
          ],

        ),
      ),
    );
  }
}

class StudentResult {
  int midTermExam;
  int finalTermExam;
  int teamLeaderPoint;
  int additionalPoint;
  bool attendance;

  StudentResult (
      this.midTermExam,
      this.finalTermExam,
      this.teamLeaderPoint,
      this.additionalPoint,
      this.attendance
      );

  @override
  String toString() {
    return '('
    '$midTermExam, '
    '$finalTermExam, '
    '$teamLeaderPoint, '
    '$additionalPoint, '
    '$attendance)';
  }
}
```
![](./flutter-week-07-01.png)
![](./flutter-week-07-02.png)

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String text = '';
  double squareside = 100;

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Gesture 사용하기
            GestureDetector(
              child: AnimatedContainer( // 애니메이션이 가능한 Container로 바뀐다
                width: squareside,
                height: squareside,
                color: Colors.orange,
                duration: Duration(seconds: 1),
              ),
              onTap:(){
                setState(() {
                  if (text == '') {
                    text = 'This is an orange square,';
                  } else {
                    text = '';
                  }
                });
              },
              onLongPress: (){
                setState(() {
                  if (squareside > 75) {
                    squareside = 50;
                    text = 'This is an small orange square,';
                  } else {
                    squareside = 100;
                    text = 'This is an normal orange square,';
                  }
                });
              },
            ),
            SizedBox(
              height: 20,
            ),
            Text(text,style: TextStyle(
              fontSize: 20
            ),)
          ],
        ),
      ),
    );
  }
}
```
![](./flutter-week-07-03.png)
![](./flutter-week-07-04.png)
![](./flutter-week-07-05.png)
![](./flutter-week-07-06.png)
